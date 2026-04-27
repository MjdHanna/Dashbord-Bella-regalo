import React, { useState } from 'react';
import { Box, Card, Typography, Stack, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { useCreateProductMutation } from '../../redux/features/services/baseApi';

export default function Products() {
  const [createProduct] = useCreateProductMutation();

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    price: '',
    images: [],
    occasionIds: [''] // 👈 مهم
  });

  const [variants, setVariants] = useState([{ price: '', stockQuantity: '', size: '', color: '' }]);

  const [features, setFeatures] = useState([{ key: '', value: '', keyAr: '', valueAr: '' }]);

  // ================= HANDLE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    setForm({ ...form, images: [...e.target.files] });
  };

  const handleOccasionChange = (index, value) => {
    const newOccasions = [...form.occasionIds];
    newOccasions[index] = value;
    setForm({ ...form, occasionIds: newOccasions });
  };

  const addOccasion = () => {
    setForm({ ...form, occasionIds: [...form.occasionIds, ''] });
  };

  // ================= VARIANTS =================
  const addVariant = () => {
    setVariants([...variants, { price: '', stockQuantity: '', size: '', color: '' }]);
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // ================= FEATURES =================
  const addFeature = () => {
    setFeatures([...features, { key: '', value: '', keyAr: '', valueAr: '' }]);
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      const fd = new FormData();

      // 🔥 BASIC
      fd.append('nameEn', form.nameEn);
      fd.append('nameAr', form.nameAr);
      fd.append('descriptionEn', form.descriptionEn);
      fd.append('descriptionAr', form.descriptionAr);
      fd.append('price', form.price);

      // 🔥 STATIC IDS (غيرهم لاحقاً حسب اختيارك)
      fd.append('categoryId', 1);
      fd.append('brandId', 1);
      fd.append('vendorId', 1);

      // 🔥 IMAGES
      form.images.forEach((img) => {
        fd.append('images[]', img);
      });

      // 🔥 OCCASIONS ✅ مطابق للباك
      form.occasionIds.forEach((id) => {
        if (id) fd.append('occasionIds[]', id);
      });

      // 🔥 VARIANTS ✅ مطابق 100%
      variants.forEach((v, i) => {
        fd.append(`variants[${i}][price]`, v.price);
        fd.append(`variants[${i}][stockQuantity]`, v.stockQuantity);
        fd.append(`variants[${i}][attributes][size]`, v.size);
        fd.append(`variants[${i}][attributes][color]`, v.color);
      });

      // 🔥 FEATURES ✅ مطابق 100%
      features.forEach((f, i) => {
        if (f.key && f.value) {
          fd.append(`features[${i}][${f.key}]`, f.value);
        }
        if (f.keyAr && f.valueAr) {
          fd.append(`featuresAr[${i}][${f.keyAr}]`, f.valueAr);
        }
      });

      await createProduct(fd).unwrap();

      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UI =================
  return (
    <Box p={3}>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        Add Product
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Add Product (Advanced)</DialogTitle>

        <DialogContent>
          <TextField fullWidth label="Name EN" name="nameEn" onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Name AR" name="nameAr" onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Description EN" name="descriptionEn" onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Description AR" name="descriptionAr" onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Price" name="price" onChange={handleChange} margin="normal" />

          {/* IMAGES */}
          <input type="file" multiple onChange={handleImages} />

          {/* OCCASIONS */}
          <Typography mt={3}>Occasions</Typography>
          {form.occasionIds.map((o, i) => (
            <TextField
              key={i}
              label="Occasion ID"
              value={o}
              onChange={(e) => handleOccasionChange(i, e.target.value)}
              sx={{ mt: 1 }}
              fullWidth
            />
          ))}
          <Button onClick={addOccasion}>+ Add Occasion</Button>

          {/* VARIANTS */}
          <Typography mt={3}>Variants</Typography>

          {variants.map((v, i) => (
            <Card key={i} sx={{ p: 2, mt: 2 }}>
              <Stack spacing={1}>
                <TextField label="Price" onChange={(e) => updateVariant(i, 'price', e.target.value)} />
                <TextField label="Stock" onChange={(e) => updateVariant(i, 'stockQuantity', e.target.value)} />
                <TextField label="Size" onChange={(e) => updateVariant(i, 'size', e.target.value)} />
                <TextField label="Color" onChange={(e) => updateVariant(i, 'color', e.target.value)} />

                <Button color="error" onClick={() => removeVariant(i)} startIcon={<DeleteIcon />}>
                  Remove
                </Button>
              </Stack>
            </Card>
          ))}

          <Button onClick={addVariant}>+ Add Variant</Button>

          {/* FEATURES */}
          <Typography mt={3}>Features</Typography>

          {features.map((f, i) => (
            <Card key={i} sx={{ p: 2, mt: 2 }}>
              <Stack spacing={1}>
                <TextField label="Wieght" onChange={(e) => updateFeature(i, 'key', e.target.value)} />
                <TextField label=" Size" onChange={(e) => updateFeature(i, 'value', e.target.value)} />

                <TextField label="الوزن" onChange={(e) => updateFeature(i, 'keyAr', e.target.value)} />
                <TextField label=" المقاس" onChange={(e) => updateFeature(i, 'valueAr', e.target.value)} />

                <Button color="error" onClick={() => removeFeature(i)}>
                  Remove
                </Button>
              </Stack>
            </Card>
          ))}

          <Button onClick={addFeature}>+ Add Feature</Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
