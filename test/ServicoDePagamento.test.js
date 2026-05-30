const assert = require('assert');
const ServicoDePagamento = require('../src/ServicoDePagamento');

describe('ServicoDePagamento', () => {
  let servico;

  beforeEach(() => {
    servico = new ServicoDePagamento();
  });

  describe('#pagar', () => {
    it('deve registrar um pagamento com as propriedades corretas', () => {
      servico.pagar('0987-7656-3475', 'Samar', 56.87);
      const pagamento = servico.consultarUltimoPagamento();
      assert.strictEqual(pagamento.codigoBarras, '0987-7656-3475');
      assert.strictEqual(pagamento.empresa, 'Samar');
      assert.strictEqual(pagamento.valor, 56.87);
    });

    it('deve atribuir categoria "cara" quando valor for maior que 100', () => {
      servico.pagar('1234-5678-9012', 'EmpresaX', 156.87);
      const pagamento = servico.consultarUltimoPagamento();
      assert.strictEqual(pagamento.categoria, 'cara');
    });

    it('deve atribuir categoria "padrão" quando valor for igual a 100', () => {
      servico.pagar('1234-5678-9012', 'EmpresaX', 100.00);
      const pagamento = servico.consultarUltimoPagamento();
      assert.strictEqual(pagamento.categoria, 'padrão');
    });

    it('deve atribuir categoria "padrão" quando valor for menor que 100', () => {
      servico.pagar('1234-5678-9012', 'EmpresaY', 50.00);
      const pagamento = servico.consultarUltimoPagamento();
      assert.strictEqual(pagamento.categoria, 'padrão');
    });

    it('deve registrar múltiplos pagamentos sem sobrescrever os anteriores', () => {
      servico.pagar('0001', 'EmpresaA', 30.00);
      servico.pagar('0002', 'EmpresaB', 200.00);
      const ultimo = servico.consultarUltimoPagamento();
      assert.strictEqual(ultimo.codigoBarras, '0002');
    });
  });

  describe('#consultarUltimoPagamento', () => {
    it('deve retornar null quando não houver pagamentos', () => {
      assert.strictEqual(servico.consultarUltimoPagamento(), null);
    });

    it('deve retornar apenas o último pagamento realizado', () => {
      servico.pagar('0001', 'EmpresaA', 30.00);
      servico.pagar('0002', 'EmpresaB', 200.00);
      servico.pagar('0003', 'EmpresaC', 75.00);
      const ultimo = servico.consultarUltimoPagamento();
      assert.strictEqual(ultimo.codigoBarras, '0003');
      assert.strictEqual(ultimo.empresa, 'EmpresaC');
      assert.strictEqual(ultimo.valor, 75.00);
      assert.strictEqual(ultimo.categoria, 'padrão');
    });

    it('deve retornar o pagamento com todas as propriedades esperadas', () => {
      servico.pagar('9999-0000-1111', 'Loja', 250.00);
      const pagamento = servico.consultarUltimoPagamento();
      assert.ok(Object.prototype.hasOwnProperty.call(pagamento, 'codigoBarras'));
      assert.ok(Object.prototype.hasOwnProperty.call(pagamento, 'empresa'));
      assert.ok(Object.prototype.hasOwnProperty.call(pagamento, 'valor'));
      assert.ok(Object.prototype.hasOwnProperty.call(pagamento, 'categoria'));
    });
  });
});
