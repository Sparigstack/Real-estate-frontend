import { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

export default function HeaderName({ header }) {
    const { setHeaderName } = useContext(UserContext);
    useEffect(() => {
        setHeaderName(header);
    }, [header, setHeaderName]);

    return null;
}
