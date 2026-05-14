import React, { useEffect, useState } from 'react';
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
  MenuItem,
  Divider,
  IconButton
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
  useGetProductByIdQuery,
  useGetOccasionsQuery
} from '../../redux/features/services/baseApi';

import SpinnerLoader from '../../ui-component/SpinnerLoader';

export default function Products() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentId, setCurrentId] = useState(null);

  const { data: products = [], isLoading } = useGetProductsQuery();

  const { data: vendorsRes } = useGetVendorsQuery();
  const vendors = vendorsRes?.data || vendorsRes || [];

  const { data: categoriesRes } = useGetCategoriesQuery();
  const categories = categoriesRes?.data || categoriesRes || [];

  const { data: brandsRes } = useGetBrandsQuery();
  const brands = brandsRes?.data || brandsRes || [];

  const { data: occasionsRes } = useGetOccasionsQuery();
  const occasions = occasionsRes?.data || occasionsRes || [];

  const { data: productDetails } = useGetProductByIdQuery(currentId, {
    skip: !currentId
  });

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const initialForm = {
    vendorId: '',
    categoryId: '',
    brandId: '',
    occasionsIds: [],
    productNameEn: '',
    productNameAr: '',
    productDescriptionEn: '',
    productDescriptionAr: '',
    price: '',
    images: []
  };

  const [form, setForm] = useState(initialForm);

  const [featuresEn, setFeaturesEn] = useState([{ key: '', value: '' }]);

  const [featuresAr, setFeaturesAr] = useState([{ key: '', value: '' }]);

  const [variants, setVariants] = useState([
    {
      variantSku: '',
      variantPrice: '',
      stockQuantity: '',
      attributesEn: [{ key: '', value: '' }],
      attributesAr: [{ key: '', value: '' }]
    }
  ]);

  useEffect(() => {
    if (productDetails?.data) {
      const data = productDetails.data;
      const product = data.product;

      setForm({
        vendorId: product.vendorId || '',
        categoryId: product.categoryId || '',
        brandId: product.brandId || '',
        productNameEn: product.productNameEn || '',
        productNameAr: product.productNameAr || '',
        productDescriptionEn: product.productDescriptionEn || '',
        productDescriptionAr: product.productDescriptionAr || '',
        price: product.price || '',
        occasionsIds: data.occasions?.map((item) => String(item.id)) || [],
        images: []
      });

      // ================= FEATURES =================

      const enFeatures =
        product.featuresEnglish && typeof product.featuresEnglish === 'object'
          ? Object.entries(product.featuresEnglish).map(([key, value]) => ({
              key,
              value
            }))
          : [{ key: '', value: '' }];

      setFeaturesEn(enFeatures);

      const arFeatures =
        product.featuresArabic && typeof product.featuresArabic === 'object'
          ? Object.entries(product.featuresArabic).map(([key, value]) => ({
              key,
              value
            }))
          : [{ key: '', value: '' }];

      setFeaturesAr(arFeatures);

      // Variants
      // ================= VARIANTS =================

      if (data.variants?.length) {
        setVariants(
          data.variants.map((variant) => ({
            variantSku: variant.variantSku || '',
            variantPrice: variant.variantPrice || variant.price || '',
            stockQuantity: variant.stockQuantity || '',

            attributesEn:
              variant.attributesEn && typeof variant.attributesEn === 'object'
                ? Object.entries(variant.attributesEn).map(([key, value]) => ({
                    key,
                    value
                  }))
                : [{ key: '', value: '' }],

            attributesAr:
              variant.attributesAr && typeof variant.attributesAr === 'object'
                ? Object.entries(variant.attributesAr).map(([key, value]) => ({
                    key,
                    value
                  }))
                : [{ key: '', value: '' }]
          }))
        );
      }
    }
  }, [productDetails]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);

    setCurrentId(null);

    setForm(initialForm);

    setFeaturesEn([{ key: '', value: '' }]);

    setFeaturesAr([{ key: '', value: '' }]);

    setVariants([
      {
        variantSku: '',
        variantPrice: '',
        stockQuantity: '',
        attributesEn: [{ key: '', value: '' }],
        attributesAr: [{ key: '', value: '' }]
      }
    ]);

    setOpen(true);
  };

  const handleEdit = (product) => {
    setCurrentId(product.id);
    setIsEdit(true);
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();

      // ================= PRODUCT =================

      fd.append('vendorId', Number(form.vendorId));

      fd.append('categoryId', Number(form.categoryId));

      fd.append('brandId', Number(form.brandId));
      // ================= OCCASIONS =================

      form.occasionsIds.forEach((id) => {
        fd.append('occasionsIds[]', Number(id));
      });

      // IMPORTANT
      fd.append('nameEn', form.productNameEn);

      fd.append('nameAr', form.productNameAr);

      fd.append('descriptionEn', form.productDescriptionEn);

      fd.append('descriptionAr', form.productDescriptionAr);

      fd.append('price', form.price !== '' ? Number(form.price) : '');
      // ================= IMAGES =================

      if (form.images?.length) {
        form.images.forEach((image) => {
          fd.append('images[]', image);
        });
      }

      // ================= FEATURES EN =================

      featuresEn.forEach((item) => {
        if (item.key && item.value) {
          fd.append(`features[0][${item.key}]`, item.value);
        }
      });

      // ================= FEATURES AR =================

      featuresAr.forEach((item) => {
        if (item.key && item.value) {
          fd.append(`featuresAr[0][${item.key}]`, item.value);
        }
      });
      // ================= VARIANTS =================

      variants.forEach((variant, index) => {
        fd.append(`variants[${index}][variantSku]`, variant.variantSku || '');

        fd.append(`variants[${index}][price]`, Number(variant.variantPrice));

        fd.append(`variants[${index}][stockQuantity]`, variant.stockQuantity !== '' ? Number(variant.stockQuantity) : '');

        // ================= ATTRIBUTES EN =================

        variant.attributesEn.forEach((attr) => {
          if (attr.key && attr.value) {
            fd.append(`variants[${index}][attributesEn][${attr.key}]`, attr.value);
          }
        });

        // ================= ATTRIBUTES AR =================

        variant.attributesAr.forEach((attr) => {
          if (attr.key && attr.value) {
            fd.append(`variants[${index}][attributesAr][${attr.key}]`, attr.value);
          }
        });
      });
      // DEBUG
      for (let pair of fd.entries()) {
        console.log(pair[0], pair[1]);
      }

      if (isEdit) {
        await updateProduct({
          id: currentId,
          formData: fd
        }).unwrap();
      } else {
        await createProduct(fd).unwrap();
      }

      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await deleteProduct(id);
    }
  };

  const handleFeatureChange = (index, field, value, isArabic = false) => {
    const copy = isArabic ? [...featuresAr] : [...featuresEn];

    copy[index][field] = value;

    isArabic ? setFeaturesAr(copy) : setFeaturesEn(copy);
  };

  const addFeature = (isArabic = false) => {
    if (isArabic) {
      setFeaturesAr([...featuresAr, { key: '', value: '' }]);
    } else {
      setFeaturesEn([...featuresEn, { key: '', value: '' }]);
    }
  };

  const removeFeature = (index, isArabic = false) => {
    const copy = isArabic ? [...featuresAr] : [...featuresEn];

    copy.splice(index, 1);

    isArabic ? setFeaturesAr(copy) : setFeaturesEn(copy);
  };

  const handleVariantChange = (index, field, value) => {
    const copy = [...variants];

    copy[index][field] = value;

    setVariants(copy);
  };
  const handleVariantAttributeChange = (variantIndex, attrIndex, field, value, isArabic = false) => {
    const copy = [...variants];

    const target = isArabic ? copy[variantIndex].attributesAr : copy[variantIndex].attributesEn;

    target[attrIndex][field] = value;

    setVariants(copy);
  };

  const addVariantAttribute = (variantIndex, isArabic = false) => {
    const copy = [...variants];

    if (isArabic) {
      copy[variantIndex].attributesAr.push({
        key: '',
        value: ''
      });
    } else {
      copy[variantIndex].attributesEn.push({
        key: '',
        value: ''
      });
    }

    setVariants(copy);
  };

  const removeVariantAttribute = (variantIndex, attrIndex, isArabic = false) => {
    const copy = [...variants];

    if (isArabic) {
      copy[variantIndex].attributesAr.splice(attrIndex, 1);
    } else {
      copy[variantIndex].attributesEn.splice(attrIndex, 1);
    }

    setVariants(copy);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        variantSku: '',
        variantPrice: '',
        stockQuantity: '',
        attributesEn: [{ key: '', value: '' }],
        attributesAr: [{ key: '', value: '' }]
      }
    ]);
  };
  const removeVariant = (index) => {
    const copy = [...variants];

    copy.splice(index, 1);

    setVariants(copy);
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
          products.map((product) => (
            <Card key={product.id} sx={{ p: 2 }}>
              <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                <img
                  src={product.image}
                  alt=""
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: 'cover',
                    borderRadius: 10
                  }}
                />

                <Box flex={1}>
                  <Typography fontWeight="bold">{product.productNameEn || product.nameEn}</Typography>

                  <Typography>{product.productNameAr || product.nameAr}</Typography>

                  <Typography>💲 {product.price}</Typography>

                  <Typography>{product.categoryNameEn || product.category}</Typography>

                  <Typography>{product.brandNameEn || product.brand}</Typography>

                  <Typography>{product.shopNameEn || product.vendor}</Typography>
                </Box>

                <Stack spacing={1}>
                  <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEdit(product)}>
                    Edit
                  </Button>

                  <Button color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(product.id)}>
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
            {/* PRODUCT INFO */}

            <TextField label="Product Name EN" name="productNameEn" value={form.productNameEn} onChange={handleChange} fullWidth />

            <TextField label="Product Name AR" name="productNameAr" value={form.productNameAr} onChange={handleChange} fullWidth />

            <TextField
              label="Description EN"
              name="productDescriptionEn"
              value={form.productDescriptionEn}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              label="Description AR"
              name="productDescriptionAr"
              value={form.productDescriptionAr}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />

            <TextField label="Price" name="price" value={form.price} onChange={handleChange} fullWidth />

            {/* SELECTS */}

            <TextField select label="Vendor" name="vendorId" value={form.vendorId} onChange={handleChange} fullWidth>
              {vendors.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.id}>
                  {vendor.name || vendor.shopNameEn}
                </MenuItem>
              ))}
            </TextField>

            <TextField select label="Category" name="categoryId" value={form.categoryId} onChange={handleChange} fullWidth>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.nameEn}
                </MenuItem>
              ))}
            </TextField>

            <TextField select label="Brand" name="brandId" value={form.brandId} onChange={handleChange} fullWidth>
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.nameEn}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Occasions"
              name="occasionsIds"
              value={form.occasionsIds}
              onChange={(e) =>
                setForm({
                  ...form,
                  occasionsIds: e.target.value
                })
              }
              SelectProps={{
                multiple: true
              }}
              fullWidth
            >
              {occasions.map((occasion) => (
                <MenuItem key={occasion.id} value={String(occasion.id)}>
                  {occasion.nameEn}
                </MenuItem>
              ))}
            </TextField>

            {/* IMAGES */}

            <input
              type="file"
              multiple
              onChange={(e) =>
                setForm({
                  ...form,
                  images: Array.from(e.target.files)
                })
              }
            />

            <Divider />

            {/* VARIANTS */}

            <Typography variant="h6">Variants</Typography>

            {variants.map((variant, index) => (
              <Card key={index} sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                    <TextField
                      label="SKU"
                      value={variant.variantSku}
                      onChange={(e) => handleVariantChange(index, 'variantSku', e.target.value)}
                      fullWidth
                    />

                    <TextField
                      label="Variant Price"
                      value={variant.variantPrice}
                      onChange={(e) => handleVariantChange(index, 'variantPrice', e.target.value)}
                      fullWidth
                    />

                    <TextField
                      label="Stock Quantity"
                      value={variant.stockQuantity}
                      onChange={(e) => handleVariantChange(index, 'stockQuantity', e.target.value)}
                      fullWidth
                    />
                  </Stack>

                  {/* ATTRIBUTES EN */}

                  <Typography variant="subtitle1">Attributes EN</Typography>

                  {variant.attributesEn.map((attr, attrIndex) => (
                    <Stack key={attrIndex} direction={isMobile ? 'column' : 'row'} spacing={2}>
                      <TextField
                        label="Key"
                        value={attr.key}
                        onChange={(e) => handleVariantAttributeChange(index, attrIndex, 'key', e.target.value)}
                        fullWidth
                      />

                      <TextField
                        label="Value"
                        value={attr.value}
                        onChange={(e) => handleVariantAttributeChange(index, attrIndex, 'value', e.target.value)}
                        fullWidth
                      />

                      <Button color="error" onClick={() => removeVariantAttribute(index, attrIndex)}>
                        <DeleteIcon />
                      </Button>
                    </Stack>
                  ))}

                  <Button startIcon={<AddIcon />} onClick={() => addVariantAttribute(index)}>
                    Add Attribute EN
                  </Button>

                  {/* ATTRIBUTES AR */}

                  <Typography variant="subtitle1">Attributes AR</Typography>

                  {(variant.attributesAr || []).map((attr, attrIndex) => (
                    <Stack key={attrIndex} direction={isMobile ? 'column' : 'row'} spacing={2}>
                      <TextField
                        label="المفتاح"
                        value={attr.key}
                        onChange={(e) => handleVariantAttributeChange(index, attrIndex, 'key', e.target.value, true)}
                        fullWidth
                      />

                      <TextField
                        label="القيمة"
                        value={attr.value}
                        onChange={(e) => handleVariantAttributeChange(index, attrIndex, 'value', e.target.value, true)}
                        fullWidth
                      />

                      <Button color="error" onClick={() => removeVariantAttribute(index, attrIndex, true)}>
                        <DeleteIcon />
                      </Button>
                    </Stack>
                  ))}

                  <Button startIcon={<AddIcon />} onClick={() => addVariantAttribute(index, true)}>
                    إضافة Attribute
                  </Button>

                  <Box textAlign="right">
                    <IconButton color="error" onClick={() => removeVariant(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Stack>
              </Card>
            ))}

            <Button startIcon={<AddIcon />} onClick={addVariant}>
              Add Variant
            </Button>

            <Divider />

            {/* FEATURES EN */}

            <Typography variant="h6">Features EN</Typography>

            {featuresEn.map((feature, index) => (
              <Stack key={index} direction={isMobile ? 'column' : 'row'} spacing={2}>
                <TextField label="Key" value={feature.key} onChange={(e) => handleFeatureChange(index, 'key', e.target.value)} fullWidth />

                <TextField
                  label="Value"
                  value={feature.value}
                  onChange={(e) => handleFeatureChange(index, 'value', e.target.value)}
                  fullWidth
                />

                <Button color="error" onClick={() => removeFeature(index)}>
                  <DeleteIcon />
                </Button>
              </Stack>
            ))}

            <Button startIcon={<AddIcon />} onClick={() => addFeature()}>
              Add Feature
            </Button>

            <Divider />

            {/* FEATURES AR */}

            <Typography variant="h6">Features AR</Typography>

            {featuresAr.map((feature, index) => (
              <Stack key={index} direction={isMobile ? 'column' : 'row'} spacing={2}>
                <TextField
                  label="المفتاح"
                  value={feature.key}
                  onChange={(e) => handleFeatureChange(index, 'key', e.target.value, true)}
                  fullWidth
                />

                <TextField
                  label="القيمة"
                  value={feature.value}
                  onChange={(e) => handleFeatureChange(index, 'value', e.target.value, true)}
                  fullWidth
                />

                <Button color="error" onClick={() => removeFeature(index, true)}>
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
