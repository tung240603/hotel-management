import RegisterForm from './RegisterForm';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/authSlice';
import './Register.scss';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postRegister } from '../../services/apiServices';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const registerHandler = async (userInfo) => {
        const { userName, name, email, phone, password } = userInfo;
        const payload = {
            username: userName,
            email: email,
            Name: name,
            phoneNumber: phone,
            password,
        };

        try {
            const res = await postRegister(payload);
            const data = res.data;

            if (!data || !data.success) {
                throw new Error(data.message || 'Unexpected error occurred');
            }

            dispatch(
                authActions.register({
                    token: data.accessToken,
                    user: data.user,
                }),
            );

            toast.success(data.message || 'Registration successful!');
            navigate('/');
        } catch (err) {
            toast.error(err.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <header className="header">
                <Link to="/" className="hehe">
                    Trang chủ
                </Link>
                <div>
                    <span>Bạn đã có tài khoản?</span>
                    <button onClick={() => navigate('/login')}>Đăng nhập</button>
                </div>
            </header>
            <RegisterForm onRegister={registerHandler} />
        </div>
    );
};

export default Register;
