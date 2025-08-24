import type { Component } from 'svelte';

export interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  [key: string]: unknown;
}

export interface PostModule {
  default: Component;  
  metadata: PostMetadata;
}