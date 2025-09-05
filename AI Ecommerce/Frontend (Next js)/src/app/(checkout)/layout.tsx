"use client";

import { usePathname, useRouter } from "next/navigation";
import { Fragment, PropsWithChildren, useEffect, useState } from "react";

import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Stepper from "@component/Stepper";
import Header from "@component/v2/Header";
import Sticky from "@component/sticky";
import Container from "@component/Container";

const stepperList = [
  { title: "Cart", disabled: false },
  { title: "Header", disabled: false },
  { title: "Payment", disabled: false },
];

export default function Layout({ children }: PropsWithChildren) {
  const [selectedStep, setSelectedStep] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  const handleStepChange = (_step: any, ind: number) => {
    switch (ind) {
      case 0:
        router.push("/cart");
        break;
      case 1:
        router.push("/checkout");
        break;
      case 2:
        router.push("/payment");
        break;
      case 3:
        router.push("/orders");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (pathname) {
      case "/cart":
        setSelectedStep(1);
        break;
      case "/checkout":
        setSelectedStep(2);
        break;
      case "/payment":
        setSelectedStep(3);
        break;
      default:
        break;
    }
  }, [pathname]);

  return (
    <Fragment>
      <Sticky fixedOn={0} scrollDistance={100}>
        <Header />
      </Sticky>
      <Container>      
      <Box mb="14px" mt="1rem">
        <Grid container spacing={6}>
          <Grid item lg={8} md={8} xs={12}>
            <Stepper
              stepperList={stepperList}
              selectedStep={selectedStep}
              // onChange={handleStepChange}
            />
          </Grid>
        </Grid>
      </Box>

      {children}
      </Container>
    </Fragment>
  );
}
