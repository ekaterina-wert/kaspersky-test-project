// import './index.css'; // for webpack

const currencyForm = document.querySelector('#currency');
const currencyArr = document.querySelectorAll('.v10__currency');

const selectedTariff = document.querySelector('.buy-block__selected-item');
const tariffDropdown = document.querySelector('.buy-block__dropdown');
const tariffArr = document.querySelectorAll('.buy-block__dropdown-item')

const newPriceBlock = document.querySelector('.buy-block__price_new');
const oldPriceBlock = document.querySelector('.buy-block__price_old');

const buyNowButton = document.querySelector('.buy-block__submit');

// tariffs object.
const tariff = {
    GBP: {
        currency: '£',
        price: {
            oneDevOneYr: 27,
            oneDevTwoYr: 43,
            threeDevOneYr: 35,
            threeDevTwoYr: 63,
            fiveDevOneYr: 43,
            fiveDevTwoYr: 71,
        },
        name: {
            oneDevOneYr: '1 Device, 1 Year',
            oneDevTwoYr: '1 Device, 2 Years',
            threeDevOneYr: '3 Devices, 1 Year',
            threeDevTwoYr: '3 Devices, 2 Years',
            fiveDevOneYr: '5 Devices, 1 Year',
            fiveDevTwoYr: '5 Devices, 2 Years',
        }
    },
    EUR: {
        currency: '€',
        price: {
            oneDevOneYr: 27,
            oneDevTwoYr: 43,
            threeDevOneYr: 35,
            threeDevTwoYr: 63,
            fiveDevOneYr: 43,
            fiveDevTwoYr: 71,
        },
        name: {
            oneDevOneYr: '1 Device, 1 Year',
            oneDevTwoYr: '1 Device, 2 Years',
            threeDevOneYr: '3 Devices, 1 Year',
            threeDevTwoYr: '3 Devices, 2 Years',
            fiveDevOneYr: '5 Devices, 1 Year',
            fiveDevTwoYr: '5 Devices, 2 Years',
        }
    },
    USD: {
        currency: '$',
        price: {
            oneDevOneYr: 27,
            oneDevTwoYr: 43,
            threeDevOneYr: 35,
            threeDevTwoYr: 63,
            fiveDevOneYr: 43,
            fiveDevTwoYr: 71,
        },
        name: {
            oneDevOneYr: '1 Device, 1 Year',
            oneDevTwoYr: '1 Device, 2 Years',
            threeDevOneYr: '3 Devices, 1 Year',
            threeDevTwoYr: '3 Devices, 2 Years',
            fiveDevOneYr: '5 Devices, 1 Year',
            fiveDevTwoYr: '5 Devices, 2 Years',
        }
    }
};

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
        const option = `${tariffBlock.name[item.dataset.tariff]} ${tariffBlock.currency}${tariffBlock.price[item.dataset.tariff]}.99`;
        item.textContent = option;
    })
}

// Select currency and set correct Price in Buy-Block
function handleSetCurrency() {
    const tariffBlock = getTariff();

    const selectedTariff = document.querySelector('.buy-block__selected-item').dataset.tariff;

    newPriceBlock.innerHTML = tariffBlock.currency + tariffBlock.price[selectedTariff] + '<span class="buy-block__price buy-block__price_new-cents">.99</span>';
    oldPriceBlock.innerHTML = tariffBlock.currency + Math.trunc(tariffBlock.price[selectedTariff] * 1.2) + '<span class="buy-block__price buy-block__price_old-cents">.99</span>';
}

// Set selected tariff and price
function handleSetTariff(item) {
    const tariffBlock = getTariff();

    const option = tariffBlock.name[item.dataset.tariff];
    selectedTariff.textContent = option;

    newPriceBlock.innerHTML = tariffBlock.currency + tariffBlock.price[item.dataset.tariff] + '<span class="buy-block__price buy-block__price_new-cents">.99</span>';
    oldPriceBlock.innerHTML = tariffBlock.currency + Math.trunc(tariffBlock.price[item.dataset.tariff] * 1.2) + '<span class="buy-block__price buy-block__price_old-cents">.99</span>';

    selectedTariff.setAttribute('data-tariff', `${item.dataset.tariff}`)
    tariffDropdown.classList.toggle('buy-block__dropdown_hidden');
}

// Submit
function handleBuyNow(e) {
    e.preventDefault();

    const tariffBlock = getTariff();

    const selectedTariff = document.querySelector('.buy-block__selected-item').dataset.tariff;

    alert(`You are going to pay ${tariffBlock.currency}${tariffBlock.price[selectedTariff]}.99. You will be redirected to the purchasing page soon.`)
}


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

// listener for submit
buyNowButton.addEventListener('click', handleBuyNow);
