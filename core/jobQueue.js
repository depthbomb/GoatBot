/*
|--------------------------------------------------------------------------
|	GoatBot! Automation
|--------------------------------------------------------------------------
|
|	Copyright (C) 2017 - 2020 Caprine Logic - https://caprine.net
|
|	This library is free software; you can redistribute it and/or
|	modify it under the terms of the GNU Lesser General Public
|	License as published by the Free Software Foundation; either
|	version 2.1 of the License, or (at your option) any later version.
|
|	This library is distributed in the hope that it will be useful,
|	but WITHOUT ANY WARRANTY; without even the implied warranty of
|	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
|	Lesser General Public License for more details.
|
|	You can receive a copy of the GNU Lesser General Public License from 
|	http://www.gnu.org/
|
|--------------------------------------------------------------------------
*/

class JobQueue {
	constructor(client) {
		this._ms = 500;
		this._client = client;
		this._queue = [];
		this._paused = true;

		this._interval;

		this.startQueue();
	}

	/**
	 * Adds a job to the job queue
	 * @param {function} job Job to add to the job queue
	 * @param {integer} delay Delay before the job should be ran in seconds
	 */
	add(func, delay = 0) {
		const snowflake = this._client.snowflake();
		const available = this._client.timestamp() + delay;

		this._queue.push({ snowflake, func, available, });

		return `Job ${snowflake} has been enqueued`;
	}

	/**
	 * Starts (and unpauses) the queue and creates its interval if not already created
	 */
	startQueue() {
		this._paused = false;
		if (!this._interval) {
			this._interval = setInterval(() => this._runJobs(), this._ms);
		}
	}

	/**
	 * Pauses the job queue without clearing the queued jobs
	 * @param {?integer} duration Duration to keep the queue paused in seconds
	 */
	pauseQueue(duration = null) {
		this._paused = true;
		if (duration) {
			setTimeout(() => {
				this._paused = false;
			}, duration*1000);
		}
	}

	/**
	 * Pauses the queue briefly and then clears it before starting it up again
	 */
	clearQueue() {
		this._paused = true;
		while (this._queue.length > 0) {
			this._queue.pop();
		}
		this._paused = false;
	}

	_runJobs() {
		if (this._paused) return;
		for (let job of this._queue) {
			if (job.available <= this._client.timestamp()) {
				const index = this._queue.indexOf(job);
				job.func();
				this._queue.splice(index, 1);
			}
		}
	}
}

module.exports = JobQueue