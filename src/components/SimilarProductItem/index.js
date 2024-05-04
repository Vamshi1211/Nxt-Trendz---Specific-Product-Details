// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachProduct} = props
  const {id, imageUrl, title, brand, price, rating} = eachProduct

  return (
    <li className="list-item-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-image"
      />
      <p className="similar-title">{title}</p>
      <p className="similar-brand">by {brand}</p>
      <div className="price-and-rating-container">
        <p className="price-heading">Rs {price}/-</p>
        <div className="rating-container">
          <p className="rating-value">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-image-height"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
