import ResultBox from './ResultBox.js';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { formatAmountInCurrency } from './../../utils/formatAmountInCurrency';

describe('Component ResultBox', () => {
  it('should render without crashing', () => {
    render(<ResultBox from='PLN' to='USD' amount={100} />);
  });
  const testAmount = [
    { amount: 10 },
    { amount: 20 },
    { amount: 500 },
    { amount: 545 },
  ];

  for (const testObj of testAmount) {
    it('should render proper info about conversion when PLN -> USD', () => {
      render(<ResultBox from='PLN' to='USD' amount={testObj.amount} />);
      const givenAmount = formatAmountInCurrency(testObj.amount, 'PLN');
      const convertedAmount = formatAmountInCurrency(
        testObj.amount / 3.5,
        'USD'
      );
      const output = screen.getByTestId('output');
      expect(output).toHaveTextContent(
        `${givenAmount} = ${convertedAmount}`.replace(/\u00a0/g, ' ')
      );
    });
  }
  const testCurrency = [
    { currency: 'USD', amount: 10 },
    { currency: 'PLN', amount: 20 },
    { currency: 'USD', amount: 550 },
    { currency: 'PLN', amount: 600 },
  ];

  for (const testObj of testCurrency) {
    it('should render proper amount if the same currency was chosen', () => {
      render(
        <ResultBox
          from={testObj.currency}
          to={testObj.currency}
          amount={testObj.amount}
        />
      );
      const givenAmount = formatAmountInCurrency(
        testObj.amount,
        testObj.currency
      );
      const output = screen.getByTestId('output');
      expect(output).toHaveTextContent(
        `${givenAmount} = ${givenAmount}`.replace(/\u00a0/g, ' ')
      );
    });
  }

  const testNegativeValues = [
    { from: 'USD', to: 'PLN', amount: -200 },
    { from: 'PLN', to: 'USD', amount: -55 },
    { from: 'USD', to: 'USD', amount: -12 },
    { from: 'PLN', to: 'PLN', amount: -5.5 },
  ];

  for (const testObj of testNegativeValues) {
    it('should return “Wrong value…” if the amount is negative', () => {
      render(
        <ResultBox
          from={testObj.from}
          to={testObj.to}
          amount={testObj.amount}
        />
      );
      const output = screen.getByTestId('output');
      expect(output).toHaveTextContent('Wrong value');
    });
  }
});
