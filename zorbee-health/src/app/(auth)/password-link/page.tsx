"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// Relative path imports
import CommonButton from "@/components/CommonButton";
import { maskEmail } from "@/utils/helper";

const PasswordLinkContent: React.FC = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const query = queryParams.get("query");
    if (query) {
      setEmail(decodeURIComponent(query));
    }
  }, [queryParams]);

  return (
    <Box>
      <Typography
        textAlign={"center"}
        fontWeight={400}
        variant={isMobile ? "h2" : "h1"}
      >
        Link{" "}
        <Typography
          component="span"
          fontWeight={500}
          variant={isMobile ? "h2" : "h1"}
        >
          sent
        </Typography>
      </Typography>
      <Typography textAlign={"center"} variant="h6">
        If the email{" "}
        <Typography component="span" fontWeight={500}>
          {email ? maskEmail(email) : ""}
        </Typography>{" "}
        is linked <br />
        to a Zorbee Health account, we&lsquo;ve sent
        <br /> you a password reset link.
      </Typography>
      <Box mt={4}>
        <CommonButton
          buttonText="Back to log-in"
          onClick={() => router.push("/sign-in")}
        />
      </Box>
    </Box>
  );
};

const PasswordLink: React.FC = () => {
  return (
    <Suspense fallback={<Typography>Loading...</Typography>}>
      <PasswordLinkContent />
    </Suspense>
  );
};

export default PasswordLink;
