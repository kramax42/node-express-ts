// import * as mongoose from 'mongoose';
// var mongoose = require('mongoose');
import { Types } from 'mongoose';
import { CommonWordModel } from '@models/common-word.model';
import { CommonWord, CommonWordWithUserStudyStatusResponseDTO } from '@interfaces/common-word.interface';
import {
	CreateCommonWordDto,
	UpdateCommonWordDto,
} from '@dtos/common-word.dto';
import { UserWordModel } from '@/models/user-word.model';
import { ICommonWordsRepository } from './common-words.repository.interface';

export class CommonWordsRepository implements ICommonWordsRepository {
	private userWordModel = UserWordModel;
	private wordModel = CommonWordModel;

	async findAll(
		skip: number,
		limit: number | null,
		userId?: string
	): Promise<CommonWordWithUserStudyStatusResponseDTO[]> {
		// const findQuery = this.wordModel
		// 	.find()
		// 	.sort({ _id: 1 })
		// 	.skip(skip)

		// if (limit) {
		// 	findQuery.limit(limit);
		// }
		// const words = await findQuery;


		console.log(skip)
		const aggregate = this.wordModel.aggregate([
			{ $sort: { _id: 1 } },
			{ $skip: skip },
			{ $limit: limit || 5 },
			// {
			// 	//https://stackoverflow.com/questions/51010754/add-only-a-field-from-another-collection-in-mongodb
			// 	$lookup: {
			// 		from: "userwords",
					
			// 		let: { nowUserId: new Types.ObjectId(userId), commonWord: '$word' },
			// 		pipeline: [
			// 			{
			// 				$match:
			// 				{
			// 					$expr:
			// 					{
			// 						// $eq: ["$word", "$$commonWord"],

			// 						$and:
			// 							[
			// 								{ $eq: ["$word", "$$commonWord"] },
			// 								{ $eq: ["$$nowUserId", "$user"] }
			// 							]
			// 					}
			// 				}
			// 			}
			// 		],
			// 		as: "userWord"
			// 	}
			// },
			// {
			// 	$addFields: {
			// 		userWordStudyStatus: "$userWord.studyStatus",
			// 		id: "$_id",
			// 	}
			// },
			// {
			// 	$unwind: "$userWordStudyStatus"
			// },
			// {
			// 	$project: {
			// 		userWord: 0,
			// 		_id: 0,
			// 		__v: 0,
			// 		["usageExamples._id"]: 0,
			// 	}
			// }
		]);

		// for (const word of words) {
		// 	const userWord = await this.userWordModel.findOne({ commonWord: word._id });
		// 	results.push({
		// 		commonWord: word,
		// 		userStudyStatus: userWord ? userWord.studyStatus : WordStudyStatus.UNKNOWN
		// 	});
		// }

		// return Promise.all(results);

		const results: CommonWordWithUserStudyStatusResponseDTO[] = await aggregate.exec();

		return results;
	}

	async create({
		word,
		translations,
		definitions,
		transcription,
		usageExamples,
	}: CreateCommonWordDto): Promise<CommonWord> {
		const createdWord = await this.wordModel.create({
			word,
			translations,
			definitions,
			transcription,
			usageExamples,
		});
		return createdWord;
	}

	async find(word: string) {
		return this.wordModel.findOne({ word }).exec();
	}

	async count(): Promise<number> {
		// return this.wordModel.countDocuments({}).exec();
		return this.wordModel.estimatedDocumentCount().exec();
	}

	async findById(id: string): Promise<CommonWord | null> {
		const foundWord = await this.wordModel.findById(id).exec();
		return foundWord;
	}

	async update(id: string, dto: UpdateCommonWordDto): Promise<CommonWord> {
		const updatedWord = await this.wordModel
			.findByIdAndUpdate(id, dto, { new: true })
			.exec();

		return updatedWord;
	}

	async delete(id: string): Promise<CommonWord> {
		const deletedWord = await this.wordModel.findByIdAndDelete(id).exec();
		return deletedWord;
	}
}

