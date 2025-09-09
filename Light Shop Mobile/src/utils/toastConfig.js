import CustomToast from "../components/CustomToast";

export const toastConfig = {
  success: props => {
    const {text1, hide, text2} = props;
    return (
      <CustomToast
        type="success"
        text1={text1}
        text2={text2}
        onPressClose={hide}
      />
    );
  },
  info: ({text1, hide, text2}) => (
    <CustomToast type="info" text1={text1} text2={text2} onPressClose={hide} />
  ),
  warning: ({text1, hide, text2}) => (
    <CustomToast
      type="warning"
      text1={text1}
      text2={text2}
      onPressClose={hide}
    />
  ),
  error: ({text1, hide, text2}) => (
    <CustomToast type="error" text1={text1} text2={text2} onPressClose={hide} />
  ),
};
