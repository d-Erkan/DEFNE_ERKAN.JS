(async function() {
  const url = 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json';
  const response = await fetch(url);
  const products = await response.json();

  function getProductHtml(product) {
    const hasDiscount = product.original_price > product.price;
    const favorites = JSON.parse(localStorage.getItem('favorites-list') || '[]');
    const isFavorite = favorites.includes(product.id.toString());
    
    const heartHtml = isFavorite ? 
      `<div class="heart ng-star-inserted" style="position: absolute; top: 10px; right: 10px; z-index: 10; cursor: pointer;" data-product-id="${product.id}">
        <img src="assets/svg/added-favorite.svg" alt="heart fill" class="heart-icon">
        <img src="assets/svg/added-favorite-hover.svg" alt="heart fill" class="heart-icon hovered">
        <div class="toolbox">
          <div class="toolbox-triangle"></div>
          <span>Listelerimi güncelle</span>
        </div>
      </div>` :
      `<div class="heart ng-star-inserted" style="position: absolute; top: 10px; right: 10px; z-index: 10; cursor: pointer;" data-product-id="${product.id}">
        <img id="default-favorite" src="assets/svg/default-favorite.svg" alt="heart" class="heart-icon">
        <img src="assets/svg/default-hover-favorite.svg" alt="heart" class="heart-icon hovered">
        <div class="toolbox">
          <div class="toolbox-triangle"></div>
          <span>Listelerime ekle</span>
        </div>
      </div>`;
    
    return `
      <div class="owl-item ng-tns-c131-1 ng-trigger ng-trigger-autoHeight active ng-star-inserted" style="width: 242px; margin-right: 20px;">
        <eb-carousel-product-item class="ng-star-inserted">
          <div class="product-item" style="position: relative;">
            ${heartHtml}
            <eb-generic-link class="product-item-anchor" event-collection="true">
              <a class="product-item-anchor ng-star-inserted" href="${product.url}">
                <figure class="product-item__img ng-star-inserted">
                  <img class="ng-star-inserted lazyloaded" alt="${product.name}" src="${product.img}">
                </figure>
                <div class="product-item-content ng-star-inserted">
                  <h2 class="product-item__brand ng-star-inserted"><b>${product.brand} - </b><span>${product.name}</span></h2>
                  <div class="product-item__price">
                    <div class="d-flex align-items-center ng-star-inserted">
                      ${hasDiscount ? `<span class='product-item__old-price ng-star-inserted'>${product.original_price} TL</span><span class='product-item__percent carousel-product-price-percent ml-2 ng-star-inserted'>%${Math.round(100 - (product.price / product.original_price) * 100)} <i class='icon icon-decrease'></i></span>` : ''}
                    </div>
                    <span class="product-item__new-price discount-product ng-star-inserted">${product.price} TL</span>
                  </div>
                </div>
              </a>
            </eb-generic-link>
            <div class="product-item-content">
              <div class="product-item__price">
                <div class="ins-add-to-cart-wrapper" ins-product-id="${product.id}">
                  <button id="addToCartBtn" type="submit" class="btn close-btn disable ng-star-inserted">Sepete Ekle</button>
                </div>
              </div>
            </div>
          </div>
        </eb-carousel-product-item>
      </div>
    `;
  }

  const productsHtml = products.map(getProductHtml).join('\n');

  const carouselHtml = `
<eb-banner-with-product-carousel>
  <div class="banner__opportunity banner">
    <div class="container">
      <eb-carousel-header>
        <div class="banner__titles">
          <h2 class="title-primary">Süper Fiyat</h2>
        </div>
      </eb-carousel-header>
      <div class="banner__wrapper banner__opportunity-wrapper">
        <owl-carousel-o class="product-list__best-products">
          <div class="owl-carousel owl-theme owl-loaded owl-responsive owl-drag">
            <div class="owl-stage-outer">
              <owl-stage>
                <div>
                  <div class="owl-stage" style="width: 9956px; transform: translate3d(0px, 0px, 0px); transition: all;">
                    ${productsHtml}
                  </div>
                </div>
              </owl-stage>
            </div>
            <div class="owl-nav disabled">
              <div class="owl-prev"><i class="icon icon-prev"></i></div>
              <div class="owl-next"><i class="icon icon-next"></i></div>
            </div>
            <div class="owl-dots disabled"></div>
          </div>
        </owl-carousel-o>
        <button aria-label="back" class="swiper-prev"></button>
        <button aria-label="next" class="swiper-next"></button>
      </div>
    </div>
  </div>
</eb-banner-with-product-carousel>
`;

  const section = document.querySelector('.Section1.has-components');
  if (section) {
    section.insertAdjacentHTML('beforeend', carouselHtml);
    
    setTimeout(() => {
      const owlStage = document.querySelector('.owl-stage');
      const prevBtn = document.querySelector('.swiper-prev');
      const nextBtn = document.querySelector('.swiper-next');
      const itemWidth = 262; // 242px width + 20px margin
      let currentPosition = 0;
      const maxItems = products.length;
      const visibleItems = Math.floor(window.innerWidth / itemWidth);
      const maxPosition = Math.max(0, (maxItems - visibleItems) * itemWidth);
      
      if (owlStage && prevBtn && nextBtn) {

        const heartElements = document.querySelectorAll('.heart');
        heartElements.forEach(heart => {
          heart.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = heart.getAttribute('data-product-id');
            
            let favorites = JSON.parse(localStorage.getItem('favorites-list') || '[]');
            
            const productIndex = favorites.indexOf(productId);
            
            if (productIndex > -1) {
              favorites.splice(productIndex, 1);
              heart.outerHTML = `<div class="heart ng-star-inserted" style="position: absolute; top: 10px; right: 10px; z-index: 10; cursor: pointer;" data-product-id="${productId}">
                <img id="default-favorite" src="assets/svg/default-favorite.svg" alt="heart" class="heart-icon">
                <img src="assets/svg/default-hover-favorite.svg" alt="heart" class="heart-icon hovered">
                <div class="toolbox">
                  <div class="toolbox-triangle"></div>
                  <span>Listelerime ekle</span>
                </div>
              </div>`;
            } else {
              favorites.push(productId);
              heart.outerHTML = `<div class="heart ng-star-inserted" style="position: absolute; top: 10px; right: 10px; z-index: 10; cursor: pointer;" data-product-id="${productId}">
                <img src="assets/svg/added-favorite.svg" alt="heart fill" class="heart-icon">
                <img src="assets/svg/added-favorite-hover.svg" alt="heart fill" class="heart-icon hovered">
                <div class="toolbox">
                  <div class="toolbox-triangle"></div>
                  <span>Listelerimi güncelle</span>
                </div>
              </div>`;
            }
            
            localStorage.setItem('favorites-list', JSON.stringify(favorites));
            
            const newHeart = document.querySelector(`[data-product-id="${productId}"]`);
            if (newHeart) {
              newHeart.addEventListener('click', arguments.callee);
            }
          });
        });
        
        prevBtn.addEventListener('click', () => {
          if (currentPosition > 0) {
            currentPosition = Math.max(0, currentPosition - itemWidth);
            owlStage.style.transform = `translate3d(-${currentPosition}px, 0px, 0px)`;
            owlStage.style.transition = 'all 0.3s ease';
          }
        });
        
        nextBtn.addEventListener('click', () => {
          if (currentPosition < maxPosition) {
            currentPosition = Math.min(maxPosition, currentPosition + itemWidth);
            owlStage.style.transform = `translate3d(-${currentPosition}px, 0px, 0px)`;
            owlStage.style.transition = 'all 0.3s ease';
          }
        });
        
        const updateButtons = () => {
          prevBtn.style.opacity = currentPosition <= 0 ? '0.5' : '1';
          nextBtn.style.opacity = currentPosition >= maxPosition ? '0.5' : '1';
          prevBtn.style.cursor = currentPosition <= 0 ? 'not-allowed' : 'pointer';
          nextBtn.style.cursor = currentPosition >= maxPosition ? 'not-allowed' : 'pointer';
        };
        
        updateButtons();
        
        prevBtn.addEventListener('click', updateButtons);
        nextBtn.addEventListener('click', updateButtons);
        
        window.addEventListener('resize', () => {
          const newVisibleItems = Math.floor(window.innerWidth / itemWidth);
          const newMaxPosition = Math.max(0, (maxItems - newVisibleItems) * itemWidth);
          if (currentPosition > newMaxPosition) {
            currentPosition = newMaxPosition;
            owlStage.style.transform = `translate3d(-${currentPosition}px, 0px, 0px)`;
          }
          updateButtons();
        });
      }
    }, 100); 
  } else {
    console.warn('Element with class "Section1 has-components" not found.');
  }
})();
