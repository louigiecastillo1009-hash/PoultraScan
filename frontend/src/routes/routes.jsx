import {Route,Routes} from 'react-router-dom'
import Login from '../pages/auth/login/Login';
import Register from '../pages/auth/register/Register';
import ForgotPassword from '../pages/auth/forgot-password/ForgotPassword';
import VerifyResetCode from '../pages/auth/verify-reset-code/VerifyResetCode';
import ResetPassword from '../pages/auth/reset-password/ResetPassword';
import Dashboard from '../pages/dashboard/page/Dashboard';
import FarmDetails from '../pages/farm/page/Farm';
import FarmList from '../pages/farm/page/FarmList';
import ScanHistory from '../pages/scan-history/page/ScanHistory';
import AiScan from '../pages/ai-scan/page/AiScan';
import ProtectedRoute from '../middleware/ProtectedRoute';
import Profile from '../pages/profile/page/Profile';
import HomeRedirect from '../middleware/HomeRedirect'
import NotFound from '../pages/not-found/page/NotFound';
import HomePage from '../pages/home/page/Home';
import { AppLayout } from '../components/index';

export default function AppRoutes(){
    return (
        <Routes>
            <Route path='/' element={<HomeRedirect/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/verify-reset-code' element={<VerifyResetCode/>}/>
            <Route path='/reset-password' element={<ResetPassword/>}/>
            <Route path='home' element={<HomePage/>} />
            <Route element={<ProtectedRoute/>}>
                <Route element={<AppLayout/>}>
                    <Route path='/dashboard' element={<Dashboard/>}/>
                    <Route path='/farm/:farmId' element={<FarmDetails/>}/>
                    <Route path='/farm' element={<FarmList/>}/>
                    <Route path='scan/history' element={<ScanHistory/>}/>
                    <Route path='/scan' element={<AiScan/>}/>
                    <Route path='/profile' element={<Profile/>}/>
                </Route>
            </Route>
            <Route element={<AppLayout/>}>
                <Route path='*' element={<NotFound/>}/>
            </Route>
        </Routes>
    )
}