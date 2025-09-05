"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import Image from "@component/Image";

import useVisibility from "./useVisibility";

import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import TextField from "@component/text-field";
import { Button, IconButton } from "@component/buttons";
import { SemiSpan } from "@component/Typography";
// STYLED COMPONENT
import { StyledRoot } from "./styles";
import { loginApi } from "api";
import { showToast } from "@utils/toastUtils";

export default function Login() {
  const router = useRouter();
  const { passwordVisibility, togglePasswordVisibility } = useVisibility();

  const initialValues = { email: "", password: "" };

  const formSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("${path} is required"),
    password: yup.string().required("${path} is required"),
  });

  const handleFormSubmit = async (values: any) => {
    let obj = {
      userName: values.email,
      password: values.password,
    };
    await loginApi(obj)
      .then((res) => {
        showToast.success("Login Successfully !");
        router.push('/')
      })
      .catch((e) => {
        console.log(e);
        showToast.error(e.message);
      });
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      onSubmit: handleFormSubmit,
      validationSchema: formSchema,
    });

  return (
    <StyledRoot mx="auto" my="2rem" boxShadow="large" borderRadius={8}>
      <form className="content" onSubmit={handleSubmit}>
        <FlexBox
          className="logo"
          alignItems="center"
          justifyContent="center"
          marginBottom="20px"
        >
          <Link href="/">
            <Image src="/assets/images/logo.svg" alt="logo" />
          </Link>
        </FlexBox>

        <TextField
          fullwidth
          mb="0.75rem"
          name="email"
          type="email"
          onBlur={handleBlur}
          value={values.email}
          onChange={handleChange}
          placeholder="example@mail.com"
          label="Email or Phone Number"
          errorText={touched.email && errors.email}
        />

        <TextField
          mb="1rem"
          fullwidth
          name="password"
          label="Password"
          autoComplete="on"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="*********"
          value={values.password}
          errorText={touched.password && errors.password}
          type={passwordVisibility ? "text" : "password"}
          endAdornment={
            <IconButton
              p="0.25rem"
              mr="0.25rem"
              type="button"
              onClick={togglePasswordVisibility}
              color={passwordVisibility ? "gray.700" : "gray.600"}
            >
              <Icon variant="small" defaultcolor="currentColor">
                {passwordVisibility ? "eye-alt" : "eye"}
              </Icon>
            </IconButton>
          }
        />

        <Button
          mb="1.65rem"
          variant="contained"
          color="primary"
          type="submit"
          fullwidth
        >
          Login
        </Button>
        <FlexBox justifyContent="center" mb="1.55rem">
          <Link href="/signup">
            <SemiSpan>Become A Banner Customer</SemiSpan>
          </Link>
        </FlexBox>
      </form>
    </StyledRoot>
  );
}
