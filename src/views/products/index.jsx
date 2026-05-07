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
  useGetVendorsQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetOccasionsQuery,
  useGetProductByIdQuery
} from '../../redux/features/services/baseApi';
import { useEffect } from 'react';
import SpinnerLoader from '../../ui-component/SpinnerLoader';
export default function Products() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentId, setCurrentId] = useState(null);
  const { data: products = [], isLoading } = useGetProductsQuery();
  const { data: vendorsRes } = useGetVendorsQuery();
  const vendors = vendorsRes?.data || vendorsRes || [];
  const { data: categoriesRes } = useGetCategoriesQuery();
  const { data: brandsRes } = useGetBrandsQuery();
  const { data: occasionsRes } = useGetOccasionsQuery();
  const { data: productDetails } = useGetProductByIdQuery(currentId, {
    skip: !currentId
  });
  const categories = categoriesRes?.data || categoriesRes || [];
  const brands = brandsRes?.data || brandsRes || [];
  const occasions = occasionsRes?.data || occasionsRes || [];
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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
  useEffect(() => {
    if (productDetails?.data) {
      const p = productDetails.data;

      setForm({
        nameEn: p.nameEn || '',
        nameAr: p.nameAr || '',
        descriptionEn: p.descriptionEn || '',
        descriptionAr: p.descriptionAr || '',
        price: p.price || '',
        vendorId: p.vendor?.id || '',
        categoryId: p.category?.id || '',
        brandId: p.brand?.id || '',
        occasionIds: p.occasions?.map((o) => o.id) || [],
        images: []
      });
      if (p.variants?.length) {
        setVariants(
          p.variants.map((v) => ({
            price: v.price || '',
            stock: v.stockQuantity || '',
            size: v.attributes?.size || '',
            color: v.attributes?.color || ''
          }))
        );
      }
      if (p.features) {
        const en = [];
        const ar = [];

        Object.entries(p.features).forEach(([key, value]) => {
          en.push({ key, value });
        });

        Object.entries(p.featuresAr || {}).forEach(([key, value]) => {
          ar.push({ key, value });
        });

        setFeatures(en.length ? en : [{ key: '', value: '' }]);
        setFeaturesAr(ar.length ? ar : [{ key: '', value: '' }]);
      }
    }
  }, [productDetails]);
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
    setOpen(true);
  };
  const handleSubmit = async () => {
    try {
      const fd = new FormData();

      fd.append('nameEn', form.nameEn);
      fd.append('nameAr', form.nameAr);
      fd.append('descriptionEn', form.descriptionEn);
      fd.append('descriptionAr', form.descriptionAr);
      fd.append('price', Number(form.price));

      fd.append('vendorId', Number(form.vendorId));
      fd.append('categoryId', Number(form.categoryId));
      fd.append('brandId', Number(form.brandId));

      form.occasionIds.forEach((id, i) => {
        fd.append(`occasionIds[${i}]`, Number(id));
      });

      form.images.forEach((file) => {
        fd.append('images[]', file);
      });

      variants.forEach((v, i) => {
        fd.append(`variants[${i}][price]`, Number(v.price));
        fd.append(`variants[${i}][stockQuantity]`, Number(v.stock));
        fd.append(`variants[${i}][attributes][size]`, v.size || '');
        fd.append(`variants[${i}][attributes][color]`, v.color || '');
      });

      features.forEach((f, i) => {
        if (f.key && f.value) {
          fd.append(`features[${i}][${f.key}]`, f.value);
        }
      });

      featuresAr.forEach((f, i) => {
        if (f.key && f.value) {
          fd.append(`featuresAr[${i}][${f.key}]`, f.value);
        }
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
  const handleFeatureChange = (index, field, value, isAr = false) => {
    const list = isAr ? [...featuresAr] : [...features];

    list[index][field] = value;

    isAr ? setFeaturesAr(list) : setFeatures(list);
  };

  const addFeature = (isAr = false) => {
    isAr ? setFeaturesAr([...featuresAr, { key: '', value: '' }]) : setFeatures([...features, { key: '', value: '' }]);
  };

  const removeFeature = (index, isAr = false) => {
    const list = isAr ? [...featuresAr] : [...features];
    list.splice(index, 1);

    isAr ? setFeaturesAr(list) : setFeatures(list);
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
          <SpinnerLoader text="Loading Products..." />
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

            <TextField select label="Vendor" name="vendorId" value={form.vendorId || ''} onChange={handleChange}>
              {vendors.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Category" name="categoryId" value={form.categoryId || ''} onChange={handleChange}>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nameEn}
                </MenuItem>
              ))}
            </TextField>

            <TextField select label="Brand" name="brandId" value={form.brandId || ''} onChange={handleChange}>
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.nameEn}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Occasions"
              SelectProps={{ multiple: true }}
              value={form.occasionIds || []}
              onChange={(e) =>
                setForm({
                  ...form,
                  occasionIds: e.target.value
                })
              }
            >
              {occasions.map((occ) => (
                <MenuItem key={occ.id} value={occ.id}>
                  {occ.nameEn}
                </MenuItem>
              ))}
            </TextField>

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

            <Typography>Features EN</Typography>

            {features.map((f, i) => (
              <Stack key={i} direction="row" spacing={1}>
                <TextField label="Key" value={f.key} onChange={(e) => handleFeatureChange(i, 'key', e.target.value)} />

                <TextField label="Value" value={f.value} onChange={(e) => handleFeatureChange(i, 'value', e.target.value)} />

                <Button color="error" onClick={() => removeFeature(i)}>
                  <DeleteIcon />
                </Button>
              </Stack>
            ))}

            <Button startIcon={<AddIcon />} onClick={() => addFeature()}>
              Add Feature
            </Button>

            <Typography>Features AR</Typography>

            {featuresAr.map((f, i) => (
              <Stack key={i} direction="row" spacing={1}>
                <TextField label="المفتاح" value={f.key} onChange={(e) => handleFeatureChange(i, 'key', e.target.value, true)} />

                <TextField label="القيمة" value={f.value} onChange={(e) => handleFeatureChange(i, 'value', e.target.value, true)} />

                <Button color="error" onClick={() => removeFeature(i, true)}>
                  <DeleteIcon />
                </Button>
              </Stack>
            ))}

            <Button startIcon={<AddIcon />} onClick={() => addFeature(true)}>
              إضافة خاصية
            </Button>
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
