import React from 'react'
import './ProductBox.css';

export default function ProductBox({item, category}) {
    return (
        <a target="_blank" href={"https://www.amazon.eg" + item.link} className="productBox">
            <img className="productImage" src={item.img} />
            <span className="ribbon">#{item.rank}</span>
            <span className="ribbon category">{item.category}</span>
            <p className="productText">{item.name}</p>
        </a>
    )
}
