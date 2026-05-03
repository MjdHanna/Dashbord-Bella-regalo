import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import {
  useCreateProductMutation,
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetVendorsQuery
} from '../../redux/features/services/baseApi';

export default function Products() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: products = [], isLoading } = useGetProductsQuery();
  const { data: vendorsRes } = useGetVendorsQuery();
  const vendors = vendorsRes?.data || vendorsRes || [];

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [form, setForm] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    price: '',
    vendorId: '',
    categoryId: '',
    brandId: '',
    occasionIds: [],
    images: []
  });

  const [variants, setVariants] = useState([{ price: '', stock: '', size: '', color: '' }]);

  const [features, setFeatures] = useState([{ key: '', value: '' }]);
  const [featuresAr, setFeaturesAr] = useState([{ key: '', value: '' }]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleOpenAdd = () => {
    setIsEdit(false);
    setCurrentId(null);

    setForm({
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      price: '',
      vendorId: '',
      occasionIds: [],
      images: []
    });

    setOpen(true);
  };

  const handleEdit = (p) => {
    setIsEdit(true);
    setCurrentId(p.id);

    setForm({
      nameEn: p.nameEn,
      nameAr: p.nameAr,
      descriptionEn: p.descriptionEn || '',
      descriptionAr: p.descriptionAr || '',
      price: p.price,
      vendorId: p.vendorId || '',
      occasionIds: p.occasions ? p.occasions.split(',') : [],
      images: []
    });

    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();

      fd.append('nameEn', form.nameEn);
      fd.append('nameAr', form.nameAr);
      fd.append('descriptionEn', form.descriptionEn);
      fd.append('descriptionAr', form.descriptionAr);
      fd.append('price', form.price);
      fd.append('vendorId', form.vendorId);
      fd.append('categoryId', form.categoryId);
      fd.append('brandId', form.brandId);
      form.occasionIds.forEach((id, i) => {
        fd.append(`occasionIds[${i}]`, id);
      });

      form.images.forEach((file) => {
        fd.append('images[]', file);
      });

      variants.forEach((v, i) => {
        fd.append(`variants[${i}][price]`, v.price);
        fd.append(`variants[${i}][stockQuantity]`, v.stock);
        fd.append(`variants[${i}][attributes][size]`, v.size);
        fd.append(`variants[${i}][attributes][color]`, v.color);
      });

      features.forEach((f, i) => {
        if (f.key) fd.append(`features[${i}][${f.key}]`, f.value);
      });

      featuresAr.forEach((f, i) => {
        if (f.key) fd.append(`featuresAr[${i}][${f.key}]`, f.value);
      });

      if (isEdit) {
        await updateProduct({ id: currentId, formData: fd }).unwrap();
      } else {
        await createProduct(fd).unwrap();
      }

      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await deleteProduct(id);
    }
  };

  return (
    <Box p={isMobile ? 2 : 3}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Products</Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Add Product
        </Button>
      </Stack>

      <Stack spacing={2}>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          products.map((p) => (
            <Card key={p.id} sx={{ p: 2 }}>
              <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                <img src={p.image} alt="" style={{ width: 120, height: 120, objectFit: 'cover' }} />

                <Box flex={1}>
                  <Typography fontWeight="bold">{p.nameEn}</Typography>
                  <Typography>{p.nameAr}</Typography>
                  <Typography>💲 {p.price}</Typography>
                  <Typography>{p.category}</Typography>
                  <Typography>{p.brand}</Typography>
                  <Typography>{p.vendor}</Typography>
                  <Typography>{p.occasions || '---'}</Typography>
                </Box>

                <Stack spacing={1}>
                  <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEdit(p)}>
                    Edit
                  </Button>

                  <Button color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(p.id)}>
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Card>
          ))
        )}
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{isEdit ? 'Edit Product' : 'Add Product'}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={2}>
            <TextField label="Name EN" name="nameEn" value={form.nameEn} onChange={handleChange} />
            <TextField label="Name AR" name="nameAr" value={form.nameAr} onChange={handleChange} />

            <TextField label="Description EN" name="descriptionEn" value={form.descriptionEn} onChange={handleChange} />
            <TextField label="Description AR" name="descriptionAr" value={form.descriptionAr} onChange={handleChange} />

            <TextField label="Price" name="price" value={form.price} onChange={handleChange} />

            <TextField label="Vendor" name="vendorId" value={form.vendorId} onChange={handleChange} />
            <TextField label="Category ID" name="categoryId" value={form.categoryId} onChange={handleChange} />

            <TextField label="Brand ID" name="brandId" value={form.brandId} onChange={handleChange} />
            <TextField
              label="Occasion IDs (1,2,3)"
              onChange={(e) =>
                setForm({
                  ...form,
                  occasionIds: e.target.value.split(',')
                })
              }
            />

            <input type="file" multiple onChange={(e) => setForm({ ...form, images: Array.from(e.target.files) })} />

            <Typography>Variants</Typography>
            {variants.map((v, i) => (
              <Stack key={i} direction="row" spacing={1}>
                <TextField
                  label="Price"
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[i].price = e.target.value;
                    setVariants(copy);
                  }}
                />
                <TextField
                  label="Stock"
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[i].stock = e.target.value;
                    setVariants(copy);
                  }}
                />
                <TextField
                  label="Size"
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[i].size = e.target.value;
                    setVariants(copy);
                  }}
                />
                <TextField
                  label="Color"
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[i].color = e.target.value;
                    setVariants(copy);
                  }}
                />
              </Stack>
            ))}

            <Typography>Feature EN</Typography>
            <TextField label="weight" onChange={(e) => setFeatures([{ key: e.target.value, value: features[0].value }])} />
            <TextField label="size" onChange={(e) => setFeatures([{ key: features[0].key, value: e.target.value }])} />

            <Typography>Feature AR</Typography>
            <TextField label="الوزن" onChange={(e) => setFeaturesAr([{ key: e.target.value, value: featuresAr[0].value }])} />
            <TextField label="الحجم" onChange={(e) => setFeaturesAr([{ key: featuresAr[0].key, value: e.target.value }])} />
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
