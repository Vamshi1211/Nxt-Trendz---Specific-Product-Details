import {Component} from 'react'
import {Loader} from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {specificProduct: {}, count: 1, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getSpecificProduct()
  }

  getSpecificProduct = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedData = {
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        title: fetchedData.title,
        price: fetchedData.price,
        description: fetchedData.description,
        brand: fetchedData.brand,
        totalReviews: fetchedData.total_reviews,
        rating: fetchedData.rating,
        availability: fetchedData.availability,
        similarProducts: fetchedData.similar_products,
      }
      this.setState({
        specificProduct: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onDecrement = () => {
    const {count} = this.state
    if (count <= 1) {
      this.setState({count: 1})
    } else {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  renderSpecificProduct = () => {
    const {specificProduct, count} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = specificProduct

    return (
      <>
        <div className="specific-product-container">
          <img
            src={imageUrl}
            alt="product"
            className="specific-product-image"
          />
          <div className="specific-details-container">
            <h1 className="title-heading">{title}</h1>
            <p className="price">Rs {price}/- </p>
            <div className="rating-reviews-container">
              <div className="rating-star-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-image"
                />
              </div>
              <p className="reviews"> {totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="in-stock">
              <span className="detail-heading">Availability: </span>
              {availability}
            </p>
            <p className="brand">
              <span className="detail-heading">Brand: </span> {brand}
            </p>
            <hr className="horizontal-line" />
            <div className="count-container">
              <button
                type="button"
                className="decrement-button"
                onClick={this.onDecrement}
                data-testid="minus"
              >
                .<BsDashSquare className="dash-square" />
              </button>
              <p className="count">{count}</p>
              <button
                type="button"
                className="decrement-button"
                onClick={this.onIncrement}
                data-testid="plus"
              >
                <BsPlusSquare className="dash-square" />.
              </button>
            </div>
            <button type="button" className="cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products">Similar Products</h1>
          <ul className="similar-products-list-container">
            {similarProducts.map(eachItem => {
              const updatedItem = {
                imageUrl: eachItem.image_url,
                title: eachItem.title,
                brand: eachItem.brand,
                price: eachItem.price,
                rating: eachItem.rating,
                id: eachItem.id,
              }
              return (
                <SimilarProductItem
                  key={updatedItem.id}
                  eachProduct={updatedItem}
                />
              )
            })}
          </ul>
        </div>
      </>
    )
  }

  continueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-view_container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-image"
      />
      <h1 className="err-msg"> Products Are Not Found</h1>
      <button
        type="button"
        className="continue-button"
        onClick={this.continueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderViews = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSpecificProduct()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderViews()}
      </>
    )
  }
}

export default ProductItemDetails
