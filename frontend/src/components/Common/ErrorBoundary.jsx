import { CircleAlert } from 'lucide-react';
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("Caught error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='d-flex justify-content-center align-items-center vh-100'>
                    <h1 className='text-danger'>
                        Something went wrong <CircleAlert size={30} />
                    </h1>
                </div>
            )
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
