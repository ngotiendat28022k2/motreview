import React from 'react';

function HeaderContent(props) {
    return (
        <div className="row justify-content-center mt-5">
            <div className="col-lg-12">
                <div className="main_title">
                    <h1 className='' style={{ fontWeight: '700', fontSize: 45 }}><span>{props.mainContent}</span></h1>
                    <p>{props.infoContent}</p>
                </div>
            </div>
        </div>

    );
}

export default HeaderContent;