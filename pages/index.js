// import './index.css'; // for webpack
import { tariff } from "../utils/tariff-plans.js";

const currencyForm = document.querySelector('#currency');
const currencyArr = document.querySelectorAll('.v10__currency');

const selectedTariff = document.querySelector('.buy-block__selected-item');
const tariffDropdown = document.querySelector('.buy-block__dropdown');
const tariffArr = document.querySelectorAll('.buy-block__dropdown-item')

const newPriceBlock = document.querySelector('.buy-block__price_new');
const oldPriceBlock = document.querySelector('.buy-block__price_old');

const buyNowButton = document.querySelector('.buy-block__submit');
const stickyBuyNowButton = document.querySelector('.sticky-buy-block__submit');

const header = document.querySelector('.v10__header');

const buyBlock = document.querySelector('.buy-block');
const stickyBuyBlock = document.querySelector('.sticky-buy-block');
const stickyTariff = document.querySelector('.sticky-buy-block__open-full');
const reachedBlock = buyBlock.offsetTop;

let scroll = 0;

// helper for picking the correct block from tariffs object according to selected currency
function getTariff() {
    const selectedCurrencyIndex = currencyForm.options.selectedIndex;
    return tariff[currencyForm.options[selectedCurrencyIndex].value];
}

// Open tariffs dropdown and fill options with tariff info in selected currency
function handleDropdownOpen() {
    const tariffBlock = getTariff();

    tariffDropdown.classList.toggle('buy-block__dropdown_hidden');

    tariffArr.forEach((item) => {
        const option = `${tariffBlock.plan[item.dataset.tariff].name} ${tariffBlock.currency}${tariffBlock.plan[item.dataset.tariff].price}.99`;
        item.textContent = option;
    })
}

// Select currency and set correct Price in Buy-Block
function handleSetCurrency() {
    const tariffBlock = getTariff();

    const selectedTariff = document.querySelector('.buy-block__selected-item').dataset.tariff;

    newPriceBlock.innerHTML = tariffBlock.currency + tariffBlock.plan[selectedTariff].price + '<span class="buy-block__price buy-block__price_new-cents">.99</span>';
    oldPriceBlock.innerHTML = tariffBlock.currency + Math.trunc(tariffBlock.plan[selectedTariff].price * 1.2) + '<span class="buy-block__price buy-block__price_old-cents">.99</span>';
}

// Set selected tariff and price
function handleSetTariff(item) {
    const tariffBlock = getTariff();

    const option = tariffBlock.plan[item.dataset.tariff].name;
    selectedTariff.textContent = option;

    newPriceBlock.innerHTML = tariffBlock.currency + tariffBlock.plan[item.dataset.tariff].price + '<span class="buy-block__price buy-block__price_new-cents">.99</span>';
    oldPriceBlock.innerHTML = tariffBlock.currency + Math.trunc(tariffBlock.plan[item.dataset.tariff].price * 1.2) + '<span class="buy-block__price buy-block__price_old-cents">.99</span>';

    stickyTariff.textContent = `${tariffBlock.currency}${tariffBlock.plan[item.dataset.tariff].price}.99 ${option}`

    selectedTariff.setAttribute('data-tariff', `${item.dataset.tariff}`)
    tariffDropdown.classList.toggle('buy-block__dropdown_hidden');
}

// Show Header on backscroll
function showHeader() {
    let top = window.pageYOffset;

    if (scroll > 300 && scroll > top) {
        header.classList.add('v10__header_fixed');

    } else if (scroll < top) {
        header.classList.remove('v10__header_fixed');
    }
    scroll = top;
}

// Buy-Block position according to scrollY
function stickBlock() {
    if ((scrollY > reachedBlock) && (!buyBlock.classList.contains('buy-block_sticky'))) {

        if (document.documentElement.clientWidth < 862) {
            buyBlock.classList.add('buy-block_hidden');
            stickyBuyBlock.classList.remove('sticky-buy-block_hidden')
        } else {
            buyBlock.classList.add('buy-block_fixed');
        }

    } else {
        if (document.documentElement.clientWidth < 862) {
            buyBlock.classList.remove('buy-block_hidden');
            stickyBuyBlock.classList.add('sticky-buy-block_hidden')
        } else {
            buyBlock.classList.remove('buy-block_fixed');
        }
    }
}

function handleShowFullBuyBlock() {
    buyBlock.classList.add('buy-block_sticky');
    stickyBuyBlock.classList.add('sticky-buy-block_hidden')
}

// Submit for purchase
function handleBuyNow(e) {
    e.preventDefault();

    const tariffBlock = getTariff();

    const selectedTariff = document.querySelector('.buy-block__selected-item').dataset.tariff;

    alert(`You are going to pay ${tariffBlock.currency}${tariffBlock.plan[selectedTariff].price}.99. You will be redirected to the purchasing page soon.`)
}

// listener for scroll: Buy-Block actions and Header on backscroll
window.addEventListener('scroll', () => {
    stickBlock();
    showHeader()
});

// listener for currency options
currencyForm.addEventListener('change', () => {
    handleSetCurrency();
});

// listener for tariff options, set selected item in Buy-Block
tariffArr.forEach((item) => {
    item.addEventListener('click', () => {
        handleSetTariff(item);
    })
})

// listener for tariffs dropdown
selectedTariff.addEventListener('click', handleDropdownOpen);

// listener for opening full Buy-Block
stickyTariff.addEventListener('click', handleShowFullBuyBlock);

// listener for submit
buyNowButton.addEventListener('click', handleBuyNow);
stickyBuyNowButton.addEventListener('click', handleBuyNow);
