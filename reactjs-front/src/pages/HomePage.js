import { React } from 'react';
import Groups from '../components/Groups';
import { useAuth } from '../components/ProtectedRoute';

const HomePage = () => {

    const data = useAuth()

    return (
        <div>
            <h1>home page</h1>
            <Groups userId={data.data.userId} />
        </div>
    );
};

export default HomePage;