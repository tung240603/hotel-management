import Chatbot from '../components/Chatbox/Chatbox';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';

function DefaultLayout({ children }) {
    return (
        <div className="layout-container">
            <Header />
            <div className="content-container">{children}</div>
            <Chatbot />
            <Footer />
            <ScrollToTop />
        </div>
    );
}

export default DefaultLayout;
