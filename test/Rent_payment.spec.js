const Rent_payment = artifacts.require('../contracts/Rent_payment.sol');
// const utils = require('./utils.js');

contract('Rent_payment', accounts => {

  let billPayment;
  let tenant = accounts[0];
  let landlord = accounts[1];
  let deposit = web3.utils.toWei('0.01', 'ether');
  let signatures = [];
  let currentTime;
  let duration = 60;

  describe('constructor', () => {
    
    before(async () => {
      currentTime = Math.floor(new Date().getTime() / 1000);
      billPayment = await Rent_payment.new(landlord, duration, { from: tenant, value: deposit });

    });

    // it('emits ChannelOpened event', async () => {
    //   assert.ok(utils.getEvent('ChannelOpened', web3.eth.getTransactionReceipt(billPayment.transactionHash)), 'should log an ChannelOpened event');
    // });

    it('sets the correct tenant', async () => {
      assert(tenant == await billPayment.tenant.call());
    });

    it('sets the correct landlord', async () => {
      assert(landlord == await billPayment.landlord.call());
    });

    it('sets the correct expiration', async () => {
      assert((currentTime + 60) == await billPayment.expiration.call());
    });

    // it('sets the correct balance', async () => {
    //   assert(deposit == await billPayment.balanceOf(landlord));
    // });
  });

  describe('extend', () => {

    before(async () => {
      currentTime = Math.floor(new Date().getTime() / 1000);
      billPayment = await Rent_payment.new(landlord, 1, { from: tenant, value: deposit });
    });

    // it('cannot update expiration to be earlier', async () => {
    //   await utils.assertFail(billPayment.extendExpiration(currentTime, { from: tenant }));
    // });

    // it('can only be called by tenant', async () => {
    //   await utils.assertFail(billPayment.extendExpiration(currentTime + 10, { from: landlord }));
    // });

    it('updates contract expiration', async () => {
      await billPayment.extend(currentTime + 10, { from: landlord });
      assert((currentTime + 10) == await billPayment.expiration.call());
    });
  });

  describe('claimTimeout', () => {

    before(async () => {
      currentTime = Math.floor(new Date().getTime() / 1000);
      billPayment = await Rent_payment.new(landlord, 1, { from: tenant, value: deposit });
    });

    // it('cannot only be called after contract expiry', async () => {
    //   await utils.assertFail(billPayment.claimTimeout({ from: tenant }));
    // });

    it('returns balance to tenant', function (done) {
      // let tenantBalance = web3.eth.getBalance(tenant).toNumber(); 
      let tenantBalance = billPayment.balanceOf(tenant);
      // let billPaymentBalance = web3.eth.getBalance(billPayment.address).toNumber();
      let billPaymentBalance = deposit;
      setTimeout(function () {
        billPayment.claimTimeout({ from: tenant }).then(tx => {
          assert(tenantBalance + billPaymentBalance >= debug (billPayment.balanceOf(tenant)));
          done();
        });
      }, 1000);
    });
  });

  describe('payRent', () => {

    let tenantBalance;
    let landlordBalance;

    before(async () => {
      currentTime = Math.floor(new Date().getTime() / 1000);
      billPayment = await Rent_payment.new(landlord, 1, { from: tenant, value: deposit });

      // generate valid signature on the client
    //   let message = await utils.constructPaymentMessage(billPayment.address, web3.toWei('1', 'ether'));
    //   let signature = await utils.signMessage(web3, message, tenant);
    //   signatures.push(signature);

      // validate signature
    //   assert(await utils.isValidSignature(billPayment.address, web3.toWei('1', 'ether'), signature, tenant));

      // save tenant and landlord balance
      tenantBalance = billPayment.balanceOf(tenant);
      landlordBalance = billPayment.balanceOf(landlord);
    });

    // it('cannot be called with invalid landlord balance', async () => {
    //   await utils.assertFail(billPayment.payRent(web3.toWei('2', 'ether'), signatures[signatures.length - 1], { from: landlord }));
    // });

    // it('cannot be called by the tenant', async () => {
    //   await utils.assertFail(billPayment.payRent(web3.toWei('1', 'ether'), signatures[signatures.length - 1], { from: tenant }));
    // });

    // it('emits a ChannelClosed event', async () => {
    //   let tx = await billPayment.payRent(web3.toWei('1', 'ether'), signatures[signatures.length - 1], { from: landlord });
    //   assert.ok(utils.getEvent('ChannelClosed', tx), 'should log an ChannelClosed event');
    // });

    // it('remits payment to tenant', async () => {
    //   assert(tenantBalance + parseInt(web3.utils.toWei('9', 'ether')) - 8e15 < billPayment.balanceOf(tenant));
    // });

    it('remits payment to landlord', async () => {
      assert(landlordBalance + deposit > billPayment.balanceOf(landlord));
    });
  });
}); 