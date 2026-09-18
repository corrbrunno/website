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

/** Listing row served straight from the database. */
export type PostSummary = {
	slug: string;
	title: string;
	description: string;
	date: string;
	views: number;
};

/** Post plus the body the page renders. */
export type PostContent = PostSummary & {
	bodyHtml: string | null;
};

/** Row with counters and tag names, ready for the post widget. */
export type PostRecord = PostSummary & {
	comments: number;
	tags: string[];
};

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
