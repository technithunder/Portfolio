import Grid from "@component/grid/Grid";
import Container from "@component/Container";
import CheckoutForm2 from "@component/v2/checkout/CheckoutForm2";
import CheckoutSummary2 from "@component/v2/checkout/CheckoutSummary2";

export default function CheckoutAlternative() {
  return (
    <Container my="1.5rem">
      <Grid container spacing={6}>
        <Grid item lg={8} md={8} xs={12}>
          <CheckoutForm2 />
        </Grid>

        <Grid item lg={4} md={4} xs={12}>
          <CheckoutSummary2 />
        </Grid>
      </Grid>
    </Container>
  );
}
