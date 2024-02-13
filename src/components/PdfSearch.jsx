import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Checkbox, Button, Grid, Card, CardContent, CardActions, Switch, FormControlLabel } from '@mui/material';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { firestore } from './firebase'; // Update the path based on your project structure
import redis from 'redis';

const PdfSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState({
    tag1: false,
    tag2: false,
    tag3: false,
  });
  const [searchByPdf, setSearchByPdf] = useState(true); // Added state for search type
  const [searchResults, setSearchResults] = useState([]);
  const redisClient = redis.createClient(); // Initialize Redis client

  useEffect(() => {
    handleSearch();
    return () => {
      redisClient.quit(); // Disconnect from Redis when component unmounts
    };
  }, []); // Run the effect once when the component mounts

  const handleSearch = async () => {
    const pdfList = await (searchByPdf ? searchPdfs() : searchTexts());
    setSearchResults(pdfList);
  };

  const handleTagChange = (tag) => {
    setTags((prevTags) => ({
      ...prevTags,
      [tag]: !prevTags[tag],
    }));
  };

  const handleSearchTypeChange = () => {
    setSearchByPdf((prevSearchByPdf) => !prevSearchByPdf);
  };

  const searchPdfs = async () => {
    const pdfList = [];

    const pdfsRef = collection(firestore, 'metadataCollection');
    let q = query(pdfsRef);

    if (searchTerm) {
      q = query(pdfsRef, where('name', '>=', searchTerm.toLowerCase()));
    }

    const selectedTags = Object.keys(tags).filter((tag) => tags[tag]);
    if (selectedTags.length > 0) {
      q = query(pdfsRef, where('tags', 'array-contains-any', selectedTags));
    }

    const querySnapshot = await getDocs(q);

    const promises = querySnapshot.docs.map(async (doc) => {
      const pdfData = doc.data();
      const pdfRef = ref(storage, `pdfs/${pdfData.name}` + '.pdf');

      try {
        const pdfUrl = await getDownloadURL(pdfRef);

        // Index text content into Redis
        const textContent = pdfData.text_content;
        indexTextContent(doc.id, textContent);

        return {
          id: doc.id,
          name: pdfData.name,
          tags: pdfData.tags,
          pdfUrl,
        };
      } catch (error) {
        console.error(`Error fetching PDF URL for ${pdfData.name}`, error);
        return null; // Return null for failed requests
      }
    });

    const results = await Promise.all(promises);
    return results.filter(Boolean); // Filter out null values
  };

  const searchTexts = async () => {
    console.log('searchTexts function called');
    const pdfList = [];

    const searchTermLowerCase = searchTerm.toLowerCase(); // Convert search term to lowercase

    // Use Redis to perform text search
    return new Promise((resolve, reject) => {
      redisClient.ft_search('pdfsIndex', searchTermLowerCase, async (err, searchResultsFromRedis) => {
        if (err) {
          console.error('Error searching in Redis:', err);
          reject([]);
        }

        const pdfIds = searchResultsFromRedis.map(result => result.docId);

        // Fetch documents from Firestore based on the IDs obtained from RedisSearch
        const promises = pdfIds.map(async (id) => {
          const pdfDoc = await getDoc(doc(firestore, 'metadataCollection', id));
          const pdfData = pdfDoc.data();

          return {
            id: pdfDoc.id,
            name: pdfData.name,
            tags: pdfData.tags,
          };
        });

        const searchResults = await Promise.all(promises);
        resolve(searchResults);
      });
    });
  };

  const indexTextContent = (pdfId, textContent) => {
    // Index the text content using RedisSearch
    redisClient.ft_add(`pdfsIndex`, pdfId, 1.0, 'FIELDS', 'textContent', textContent, (err) => {
      if (err) {
        console.error('Error indexing text content:', err);
      }
    });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 4, color: 'white' }}>
        PDF Search Page
      </Typography>

      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <TextField
          label="Search Term"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ sx: { color: 'white' } }} // Set text color to white
        />

        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={4}>
            <Checkbox checked={tags.tag1} onChange={() => handleTagChange('tag1')} />
            <Typography variant="body2" sx={{ color: 'white' }}>Tag 1</Typography>
          </Grid>
          <Grid item xs={4}>
            <Checkbox checked={tags.tag2} onChange={() => handleTagChange('tag2')} />
            <Typography variant="body2" sx={{ color: 'white' }}>Tag 2</Typography>
          </Grid>
          <Grid item xs={4}>
            <Checkbox checked={tags.tag3} onChange={() => handleTagChange('tag3')} />
            <Typography variant="body2" sx={{ color: 'white' }}>Tag 3</Typography>
          </Grid>
        </Grid>

        <FormControlLabel
          control={<Switch checked={searchByPdf} onChange={handleSearchTypeChange} />}
          label="Search by PDF"
          sx={{ color: 'white', marginTop: 2 }}
        />

        <Button type="submit" variant="contained" color="primary">
          {searchByPdf ? 'Search PDFs' : 'Search Texts'}
        </Button>
      </form>

      <Grid container spacing={2} sx={{ marginTop: 4 }}>
        {searchResults.map((pdf) => (
          <Grid item key={pdf.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white' }}>{pdf.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: 'white' }}>
                  Tags: {pdf.tags.join(', ')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => window.open(pdf.pdfUrl, '_blank')}>
                  View PDF
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PdfSearch;
