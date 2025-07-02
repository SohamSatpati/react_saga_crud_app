import React from 'react';

jest.mock('../App', () => () => <div>Mock App</div>);
jest.mock('../reportWebVitals', () => jest.fn());

describe('index.js', () => {
  let rootMock;
  let createRootSpy;

  beforeEach(() => {
    // Mock the root element
    document.body.innerHTML = '<div id="root"></div>';
    rootMock = { render: jest.fn() };
    createRootSpy = jest
      .spyOn(require('react-dom/client'), 'createRoot')
      .mockReturnValue(rootMock);
  });

  afterEach(() => {
    jest.resetModules();
    createRootSpy.mockRestore();
  });

  it('renders App without crashing', () => {
    require('../index');
    expect(createRootSpy).toHaveBeenCalledWith(document.getElementById('root'));
    expect(rootMock.render).toHaveBeenCalled();
  });

  it('calls reportWebVitals', () => {
    const reportWebVitals = require('../reportWebVitals');
    require('../index');
    expect(reportWebVitals).toHaveBeenCalled();
  });
});
