import React from 'react';
import "./InfoDetailProduct.scss";

function DescriptionProduct(props) {
    return (
        <div >
            <div dangerouslySetInnerHTML={{ __html: props.data }}>
            </div>
        </div>
    );
}

export default DescriptionProduct;