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
import { StyledRoot } from "./styles";
import { getNavigationList, loginApi } from "api";
import { showToast } from "@utils/toastUtils";
import { useDispatch } from "react-redux";
import { loginSuccess } from "store/slices/authSlice";
import { useEffect, useState } from "react";
import Spinner from "@component/Spinner";
import { clearCart } from "store/slices/cartSlice";
import { getSessionStorage, setSessionStorage } from "@utils/sessionStorage";

interface Props {
  toggleDialog?: () => void;
}

export default function Login({ toggleDialog }: Props) {
  const dispatch = useDispatch();
  const router = useRouter()
  const { passwordVisibility, togglePasswordVisibility } = useVisibility();
  const [loading, setLoading] = useState<boolean>(false)
  const [navigationList,setNavigationList] = useState([])
  const initialValues = { email: "", password: "" };

  const formSchema = yup.object().shape({
    email: yup.string(),
    password: yup.string().required("${path} is required"),
  });

  const fetchNavigationList = async () => {
      try {
        const storedData = getSessionStorage("navigationList");
        if (storedData) {
          setNavigationList(storedData);
          return;
        }
        const res = await getNavigationList();
        const data = res?.data
  
        if (data) {
          let tempArr = [];
  
          Object.keys(data).sort().map((ele, index) => {
            tempArr.push({
              title: ele,
              child: data[ele].map((item) => ({
                title: item,
                href: `/catelog?ItemsGroup3=${ele.replaceAll(
                  " ",
                  "-"
                )}&ItemsGroup4=${item.replaceAll(" ", "-")}`,
              })),
              href: `#`,
            });
          });
          setSessionStorage("navigationList", tempArr);
          setNavigationList(tempArr || []);
        }
      } catch (error) {
        console.error("Error fetching customer list:", error);
      }
    };

    useEffect(() => {
      fetchNavigationList();
    }, []);

  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    let obj = {
      userName: values.email,
      password: values.password,
    };

    try {
      const res = await loginApi(obj);
      if (res.data?.token) {
        dispatch(loginSuccess(res.data.token));
        showToast.success("Login Successfully!");
        dispatch(clearCart());
        router.push('/')
        toggleDialog && toggleDialog();
      }
      else {
        throw new Error("Invalid login response!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      showToast.error(error.message || "Login failed!");
    } finally {
      setLoading(false);
    }
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
          type="button"
          fullwidth
          onClick={() => handleSubmit()}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Login"}
        </Button>
        <FlexBox justifyContent="center" mb="1.55rem">
          <Link target="_blank" href="https://www.bannerwholesale.com/join/">
            <SemiSpan>Become A Banner Customer</SemiSpan>
          </Link>
        </FlexBox>
        <FlexBox justifyContent="center" mb="1.55rem">
          <Link target="_blank" href="/catelog">
            <SemiSpan>View Products</SemiSpan>
          </Link>
        </FlexBox>
      </form>
    </StyledRoot>
  );
}
