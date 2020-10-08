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
		this._client = client;
		this._queue = [];

		this._startQueue();
	}

	/**
	 * Adds a job to the job queue
	 * @param {function} job Job to add to the job queue
	 * @param {integer} delay Delay (in seconds) before the job should be ran
	 */
	push(func, delay = 0) {
		const snowflake = this._client.snowflake();
		const available = this._client.timestamp() + delay;
		const _job = { snowflake, func, available, };

		this._queue.push(_job);

		return `Job ${snowflake} has been enqueued`;
	}

	_startQueue() {
		setInterval(() => {
			for (let job of this._queue) {
				if (job.available <= this._client.timestamp()) {
					const index = this._queue.indexOf(job);
					job.func();
					this._queue.splice(index, 1);
				}
			}
		}, 500);
	}
}

module.exports = JobQueue