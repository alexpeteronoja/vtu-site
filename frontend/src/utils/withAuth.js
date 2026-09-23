import Cookies from 'js-cookie';

const withAuth = () => {
    const userRole = Cookies.get('userRole');
    const accessToken = Cookies.get('userAccessToken');
    
    // Parse user data if stored as JSON string
    const userString = Cookies.get('userData');
    let user = null;
    try {
        if (userString) {
            user = JSON.parse(userString);
        }
    } catch (error) {
        console.error("Failed to parse user data from cookie", error);
    }
    
    const isAuthenticated = !!accessToken;

    return { isAuthenticated, userRole, accessToken, user };
};

export default withAuth;
