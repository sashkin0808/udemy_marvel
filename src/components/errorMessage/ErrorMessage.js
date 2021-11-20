import img from './error.gif';

const ErrorMessage = () => {
    return (
        <img src={img} style={{display:'block', width: '250px', height: '250px', margin: '0 auto'}} alt="error" />
    )
}
export default ErrorMessage;