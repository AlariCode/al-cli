import { homedir } from 'os';
import * as path from 'path';
import Datastore from 'nedb';

export interface IStorageItem<T> {
	key: string;
	data: T;
}

export class ConfigRepository {
	private static db: Datastore = new Datastore({ filename: path.join(homedir(), '/al-cli-bd.db'), autoload: true });;

	public static async updateDBKey<T>(key: string, data: T) {
		return new Promise<void>(resolve => {
			ConfigRepository.db.update({ key }, { $set: { data } }, { upsert: true }, () => {
				resolve();
			});
		});
	}

	public static async loadDBKey<T>(key: string): Promise<IStorageItem<T>> {
		return new Promise((resolve, reject) => {
			ConfigRepository.db.findOne({ key }, (err, doc) => {
				if (err) {
					reject(err);
				}
				if (!doc) {
					reject();
				}
				resolve(doc);
			});
		});
	}

	public static async getValueOrDefault<T>(key: string): Promise<IStorageItem<T>> {
		return new Promise((resolve, reject) => {
			ConfigRepository.db.findOne({ key }, (err, doc) => {
				if (err) {
					reject(err);
				}
				resolve(doc);
			});
		});
	}
}
