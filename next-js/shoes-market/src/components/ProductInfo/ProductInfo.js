import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const ProductInfo = ({ data }) => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const parsedData = useMemo(() => {
    const htmlContent = data?.description.replace(/\\n/g, "<br />");
    return htmlContent;
  }, [data]);

  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              textColor="black"
              aria-label="lab API tabs example"
            >
              <Tab label="Description" value="1" />
              <Tab label="Additional Information" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div dangerouslySetInnerHTML={{ __html: parsedData }} />
          </TabPanel>
          <TabPanel value="2">
            <Box display="flex" gap={1}>
              <Typography fontWeight={600}>Size</Typography>
              <Box display="flex" flexWrap="wrap">
                {data?.size?.map((item, index) => (
                  <Typography key={index}>{item},&nbsp;</Typography>
                ))}
              </Box>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default ProductInfo;
