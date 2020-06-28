$(document).ready(function () {
  $('.tabs-link a').on('click', function () {
    const tabText = $(this).text();
    const tabLink = $(this).attr('href').replace('#', '');
    const params = new URLSearchParams(location.search);
    params.set('tab', tabLink);
    history.pushState(null, tabText, location.pathname + '?' + params.toString());
  });

  const currentParams = new URLSearchParams(location.search);
  const currentTab = currentParams.get('tab');
  const tabActive = $(`#${currentTab}-tab`);
  if (tabActive) {
    tabActive.click();
  }
});

$('.select2').select2()

$('.data-picker-single').daterangepicker({
  timePicker: false,
  singleDatePicker: true,
  locale: {
    format: 'DD/MM/YYYY'
  }
})

var setPersonType = function (formPersonType) {
  const personType = $(formPersonType.data('select'));
  const label = $(formPersonType.data('label'));

  const person_type = personType.val();

  if (person_type === 'legal') {
    label.find('span').text('CNPJ');
    $('#input_person_type_document').attr('data-usemask', 'cnpj');
  } else {
    $('#input_person_type_document').attr('data-usemask', 'cpf');
    label.find('span').text('CPF');
  }
}

const formPersonType = $('.form-person-type');

if (formPersonType.length > 0) {
  setPersonType(formPersonType);

  $(formPersonType.data('select')).on('change', function () {
    setPersonType(formPersonType);
  });
}

function getCities(state_id) {
  $('.select-city select[name="city_id"]').empty(`<option value"">Aguarde...</option>`);

  $.getJSON(`/admin/city?state_id=` + state_id, function (response) {
    $('.select-city select[name="city_id"]').empty();
    response.forEach(function (city) {
      $('.select-city select[name="city_id"]').append(`<option value="${city.id}">${city.name}</option>`);
    });
  })
}
$('.select-city select[name="state_id"]').on('change', function () {
  getCities($(this).val())
});

$('.changeToggleStatus').on('click', function () {
  $(this).text('Aguarde...');
  $.post($(this).data('url'), function () {
    location.reload();
  })
})

const ws = adonis.Ws('ws://192.168.15.17:3333', {
  reconnection: true,
  reconnectionDelay: 1000,
})
ws.connect()

function connectWebsocket() {
  ws.on('open', () => {
    websocketEvents();
  })

  ws.on('close', () => {
    console.log('close')
  });
}

function websocketEvents() {
  const auctionbid = ws.getSubscription('auctionbid') || ws.subscribe('auctionbid')

  auctionbid.on('new', (result) => {
    const { bid } = result;

    $('#auction-mode-online #auction-online #total-value').html(currency(result.auction.total_bid));
    $('#auction-mode-online #auction-online #total-bids').html(result.auction.__meta__.bids_count);

    $('#auction-mode-online #bids-online tbody').prepend(`
      <tr data-element="${bid.id}">
        <td>${bid.id}</td>
        <td>${bid.user.name} ${bid.user.lastname}</td>
        <td>${bid.user.phone}</td>
        <td>${bid.user.city.name} ${bid.user.city.state.uf}</td>
        <td><strong>${currency(bid.price)}</strong></td>
      </tr>
    `);

    $('#auction-mode-online #bid-rank tbody').empty()

    result.ranks.forEach(function (rank) {
      $('#auction-mode-online #bid-rank tbody').prepend(`
        <tr data-element="${rank.id}">
          <td>${rank.id}</td>
          <td>${rank.user.name} ${rank.user.lastname}</td>
          <td>${rank.user.phone}</td>
          <td>${rank.user.city.name} ${rank.user.city.state.uf}</td>
          <td><strong>${currency(rank.total)}</strong></td>
          <td>
            <a href="/admin/auction/make-finish/${bid.auction_id}?winner_id=${rank.user.id}" class="btn btn-sm btn-default">
                <i class="fa fa-check"></i> Arrematar
            </a>
          </td>
        </tr>
      `);
    });
  });

  auctionbid.on('message', (message) => {
  });
}

if ($('#auction-mode-online').length > 0) {
  connectWebsocket();
}

function currency(value) {
  var value = value.toFixed(2).split('.');
  value[0] = "R$ " + value[0].split(/(?=(?:...)*$)/).join('.');
  return value.join(',');
}

// Delete Register Ajax
$('.deleteRegisterAjax').on('click', function () {
  if (!confirm('Remover esse registro?')) return false;

  $(this).attr('disabled', true);

  const url = $(this).data('url');
  const id = $(this).data('id');
  const element = $(`[data-element="${id}"]`);
  const _token = $('meta[name="csrf-token"]').attr('content');

  $.ajax({
    url,
    type: 'DELETE',
    data: {
      _token
    },
    success: function () {
      element.fadeOut();
    },
    beforeSend: function () {
      element.css('opacity', .8);
    }
  });
});

$("input[data-usemask='price']").maskMoney({ prefix: 'R$ ', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false });


