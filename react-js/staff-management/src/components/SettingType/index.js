import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Grid,
  Box,
  TextField,
  Stack,
  Button,
  CircularProgress
} from '@mui/material';

const SettingType = ({ initialValues, onCancel, fields, onSave }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ mx: 3 }}>
      <Box p={2}>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape(
            (fields || []).reduce((acc, field) => {
              acc[field.name] = field.validationSchema;
              return acc;
            }, {})
          )}
          onSubmit={async (
            values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              onSave(values);
              resetForm();

              setStatus({ success: true });
              setSubmitting(false);
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {(fields || []).map((field) => (
                  <Grid item xs={12} md={6} key={field.name}>
                    <TextField
                      fullWidth
                      name={field.name}
                      helperText={touched[field.name] && errors[field.name]}
                      error={Boolean(touched[field.name] && errors[field.name])}
                      value={values[field.name]}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={field.label}
                      placeholder={field.placeholder || field.label}
                    />
                  </Grid>
                ))}
              </Grid>

              <Stack direction="row" spacing={2} mt={5}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  color="primary"
                >
                  {t('Submit')}
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={onCancel}
                  color="primary"
                >
                  {t('Cancel')}
                </Button>
              </Stack>
            </form>
          )}
        </Formik>
      </Box>
    </Card>
  );
};

export default SettingType;
