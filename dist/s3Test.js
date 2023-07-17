"use strict";
require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.CMS_DEFAULT_REGION,
    accessKeyId: process.env.CMS_ACCESS_KEY_ID,
    secretAccessKey: process.env.CMS_SECRET_ACCESS_KEY_ID,
});
const test = [
    {
        name: 'test',
        goal: 's3',
    },
    {
        name: 'obj2',
        goal: 'again',
    },
];
const s3 = new AWS.S3();
//ads file or replaces if already exists
const addFile = async () => {
    await s3
        .putObject({
        Body: JSON.stringify(test),
        Bucket: 'townsquareinteractive',
        Key: 'test.json',
    })
        .promise();
    console.log('Object Placed');
};
//deletes file
const deleteFile = async () => {
    await s3
        .deleteObject({
        Bucket: '',
        Key: 'test.json',
    })
        .promise();
    console.log('File Delete');
};
addFile();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczNUZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vczNUZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDMUIsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQzlCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCO0lBQ3RDLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQjtJQUMxQyxlQUFlLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0I7Q0FDeEQsQ0FBQyxDQUFBO0FBRUYsTUFBTSxJQUFJLEdBQUc7SUFDVDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLElBQUk7S0FDYjtJQUNEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsT0FBTztLQUNoQjtDQUNKLENBQUE7QUFFRCxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUV2Qix3Q0FBd0M7QUFDeEMsTUFBTSxPQUFPLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFDdkIsTUFBTSxFQUFFO1NBQ0gsU0FBUyxDQUFDO1FBQ1AsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQzFCLE1BQU0sRUFBRSx1QkFBdUI7UUFDL0IsR0FBRyxFQUFFLFdBQVc7S0FDbkIsQ0FBQztTQUNELE9BQU8sRUFBRSxDQUFBO0lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUNoQyxDQUFDLENBQUE7QUFFRCxjQUFjO0FBQ2QsTUFBTSxVQUFVLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFDMUIsTUFBTSxFQUFFO1NBQ0gsWUFBWSxDQUFDO1FBQ1YsTUFBTSxFQUFFLEVBQUU7UUFDVixHQUFHLEVBQUUsV0FBVztLQUNuQixDQUFDO1NBQ0QsT0FBTyxFQUFFLENBQUE7SUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQzlCLENBQUMsQ0FBQTtBQUVELE9BQU8sRUFBRSxDQUFBIn0=