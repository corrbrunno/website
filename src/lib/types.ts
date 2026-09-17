import type { Component } from 'svelte';

export interface PostMetadata {
	title: string;
	date: string;
	description?: string;
	slug: string;
	views?: number;
	comments?: number;
	tags?: string[];
	[key: string]: unknown;
}

export interface PostModule {
	default: Component;
	metadata: PostMetadata;
}

export interface PostStats {
	views: number;
	comments: number;
}

export interface TagSummary {
	slug: string;
	name: string;
	total: number;
}

export interface Comment {
	id: number;
	author: string;
	body: string;
	createdAt: string;
}
