import themeReducers from "../slice/themeSlice";
import authReducers from "../slice/authSlice";
import userProgressReducers from "../slice/progressSlice";
import dashboardTabReducers from "../slice/activeDashboardTabSlice"

const rootReducer = {
    theme: themeReducers,
    auth: authReducers,
    userProgress: userProgressReducers,
    dashboardTab: dashboardTabReducers,
}

export default rootReducer;