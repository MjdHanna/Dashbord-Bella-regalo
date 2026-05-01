import React, { useState } from 'react';
import { Box, Card, Typography, Stack, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useCreateProductMutation } from '../../redux/features/services/baseApi';

export default function Products() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [createProduct] = useCreateProductMutation();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    price: '',
    images: [],
    occasionIds: ['']
  });

  const [variants, setVariants] = useState([{ price: '', stockQuantity: '', size: '', color: '' }]);
  const [features, setFeatures] = useState([{ key: '', value: '', keyAr: '', valueAr: '' }]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const fd = new FormData();

    fd.append('nameEn', form.nameEn);
    fd.append('nameAr', form.nameAr);
    fd.append('price', form.price);

    await createProduct(fd);
    setOpen(false);
  };

  return (
    <Box p={isMobile ? 2 : 3}>
      <Button fullWidth={isMobile} variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        Add Product
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Add Product</DialogTitle>

        <DialogContent>
          <Stack spacing={2}>
            <TextField label="Name EN" name="nameEn" onChange={handleChange} fullWidth />
            <TextField label="Name AR" name="nameAr" onChange={handleChange} fullWidth />
            <TextField label="Price" name="price" onChange={handleChange} fullWidth />

            {/* VARIANTS */}
            <Typography>Variants</Typography>
            {variants.map((v, i) => (
              <Card key={i} sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <TextField label="Price" />
                  <TextField label="Stock" />

                  <Button color="error" startIcon={<DeleteIcon />}>
                    Remove
                  </Button>
                </Stack>
              </Card>
            ))}

            <Button onClick={() => setVariants([...variants, { price: '' }])}>+ Add Variant</Button>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
