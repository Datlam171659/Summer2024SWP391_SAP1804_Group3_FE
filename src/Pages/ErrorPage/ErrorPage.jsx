import { Result } from 'antd';
import "./ErrorPage.scss"

function ErrorPage() {
    return (
        <div className="wrapper">
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
            />
        </div>
    );
}

export default ErrorPage;