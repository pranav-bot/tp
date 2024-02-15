import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Checkbox, Button, Grid, Card, CardContent, CardActions, Switch, FormControlLabel, } from '@mui/material';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { firestore, storage } from './firebase';
import { createClient } from '@supabase/supabase-js';


const PdfSearch = () => {
  const supabaseUrl = 'https://annbilbdnvdifaveagps.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubmJpbGJkbnZkaWZhdmVhZ3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4NDQ2NTEsImV4cCI6MjAyMzQyMDY1MX0.3FoPOUWSP6kKBrS_B7GoFwAY_rA1pSqCgX-BW2SVGZg'
  const supabase = createClient(supabaseUrl, supabaseKey)
 const [searchTerm, setSearchTerm] = useState('');
 const [tags, setTags] = useState({
  tag1: false,
  tag2: false,
  tag3: false,
 });
 const [searchByPdf, setSearchByPdf] = useState(true); // Added state for search type
 const [searchResults, setSearchResults] = useState([]);


 useEffect(() => {
  handleSearch();
}, []);// Run the effect once when the component mounts

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

  let { data: pdfsCollection, error } = await supabase
    .from('pdfsCollection')
    .select()
    .textSearch('text',`'potty' | '${searchTermLowerCase}'`)

  if (error) {
    console.error('Error searching PDFs:', error.message);
    return pdfList; // Return empty array if there's an error
  }

  if (pdfsCollection) {
    // Iterate through search results and extract relevant PDF data
    pdfsCollection.forEach(pdf => {
      pdfList.push({
        id: pdf.id, // Assuming 'id' is the unique identifier of the PDF
        name: pdf.name,
        tags: pdf.tags, // Assuming 'tags' is an array of tags associated with the PDF
        pdfUrl: pdf.url // Assuming 'url' is the URL to access the PDF
      });
    });
  }

  
  return pdfList;
};

return (
  <Container sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Typography variant="h4" sx={{ marginBottom: 4, color: 'white' }}>
      PDF Search Page
    </Typography>

    {/* Form for search input */}
  
    <form onSubmit={(e) => { e.preventDefault(); handleSearch();}} style={{ width: '100%', maxWidth: '500px' }}>
      <TextField
        label="Search Term"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{ sx: { color: 'black', backgroundColor: "white" } }}
      />

      {/* Checkboxes for tags */}
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

      {/* Switch for search type */}
      <FormControlLabel
        control={<Switch checked={searchByPdf} onChange={handleSearchTypeChange} />}
        label="Search by PDF"
        sx={{ color: 'white', marginTop: 2 }}
      />

      {/* Button for submitting search */}
      <Button type="submit" variant="contained" color="primary" sx={{ width: '100%' }}>
        {searchByPdf ? 'Search PDFs' : 'Search Texts'}
      </Button>
    </form>

    {/* Display search results */}
    <Grid container spacing={2} sx={{ marginTop: 4 }}>
      {searchResults.map((pdf) => (
        <Grid item key={pdf.id} xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{color:'grey'}}>
              <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>{pdf.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ color: 'black' }}>
                Tags: {Array.isArray(pdf.tags) ? pdf.tags.join(', ') : 'No tags'} {/* Handle non-array tags */}
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
      }
export default PdfSearch;