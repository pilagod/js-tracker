/// <reference path='../node_modules/@types/chrome/index.d.ts' />

interface IConnectionCache {
  add(
    tabID: string,
    port: chrome.runtime.Port
  ): void;

  get(
    tabID: string
  ): chrome.runtime.Port;

  has(
    tabID: string
  ): boolean;

  remove(
    port: chrome.runtime.Port
  ): void;
}