import { config } from 'dotenv';
config();
import request from 'request-promise';
const tsiBucket = 'townsquareinteractive';
const bucketUrl = 'https://townsquareinteractive.s3.amazonaws.com';
import { S3 } from '@aws-sdk/client-s3';
import { ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
const s3 = new S3({
    credentials: {
        accessKeyId: process.env.CMS_ACCESS_KEY_ID || '',
        //logger: console,
        secretAccessKey: process.env.CMS_SECRET_ACCESS_KEY_ID || '',
    },
    region: process.env.CMS_DEFAULT_REGION,
});
// Utility function to convert a Readable Stream to a string (needed for sdk v3)
const streamToString = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        stream.on('error', (error) => reject(error));
    });
};
//Get S3 object and return, if not found return passed object
export const getFileS3 = async (key, rtnObj = { pages: [] }, type = 'json') => {
    try {
        const data = await s3.getObject({ Bucket: tsiBucket, Key: key });
        if (data.Body) {
            // Convert the Readable Stream to a string
            const rawBody = await streamToString(data.Body);
            // If the content is JSON, return it directly
            try {
                const jsonData = JSON.parse(rawBody);
                return jsonData;
            }
            catch (jsonError) {
                // If parsing as JSON fails, return the raw string
                console.log('Failed to parse as JSON. Returning raw string.');
                return rawBody;
            }
        }
    }
    catch (err) {
        console.log(`File ${key} not found in S3, creating a new file`);
        return rtnObj;
    }
};
/* export const fileExistsInS3 = async (key: string): Promise<boolean> => {
    try {
        await s3.headObject({ Bucket: tsiBucket, Key: key })
        return true // Object exists
    } catch (err) {
        if (err.code === 'NotFound') {
            console.log(`File ${key} not found in S3`)
            return false // Object does not exist
        }
        console.error(`Error checking if file ${key} exists in S3:`, err)
        throw err // Handle other errors
    }
} */
export const folderExistsInS3 = async (folderKey) => {
    try {
        const listObjectsResponse = await s3.listObjectsV2({
            Bucket: tsiBucket,
            Prefix: folderKey.endsWith('/') ? folderKey : folderKey + '/',
            MaxKeys: 1, // Only need to check if there is at least one object
        });
        return listObjectsResponse.Contents ? listObjectsResponse.Contents.length > 0 : false;
    }
    catch (error) {
        console.error(`Error checking if folder ${folderKey} exists in S3:`, error);
        throw error; // Handle other errors
    }
};
//add file to s3 bucket
export const addFileS3 = async (file, key, fileType = 'json') => {
    const s3ContentType = fileType.includes('css') ? 'text/css' : 'application/json';
    const body = fileType === 'json' ? JSON.stringify(file) : file;
    await s3
        .putObject({
        Body: body,
        Bucket: tsiBucket,
        Key: key + `.${fileType}`,
        ContentType: s3ContentType,
    })
        .catch((error) => {
        console.error(error);
    });
    console.log('File Placed');
};
//add file to s3 bucket
export const addFolderS3 = async (file, key) => {
    await s3
        .putObject({
        Bucket: tsiBucket,
        Key: file + '/',
    })
        .catch((error) => {
        console.error(error);
    });
    console.log('S3 folder created');
};
//adds file from luna site to s3 folder (used for favicons)
export const addAssetFromSiteToS3 = async (file, key) => {
    var options = {
        uri: 'http://' + file,
        encoding: null,
    };
    request(options, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            console.log('failed to get image');
            console.log(error);
        }
        else {
            s3.putObject({
                Body: body,
                Key: key,
                Bucket: tsiBucket,
            }, function (error, data) {
                if (error) {
                    console.log('error downloading image to s3');
                }
                else {
                    console.log('success uploading to s3');
                }
            });
        }
    });
};
//adding a page file for each page in cms data
export const addMultipleS3 = async (data, pageList, basePath) => {
    const pages = data.pages;
    //adding page list file to s3
    addFileS3(pageList, `${basePath}/pages/page-list`);
    //adding page files to s3
    for (let i = 0; i < data.pages.length; i++) {
        addFileS3(data.pages[i], `${basePath}/pages/${pages[i].slug}`);
    }
    //add full site data to s3
    addFileS3(data, `${basePath}/siteData`);
};
export const moveAllS3Objs = async () => {
    /* await s3.listObjects({Prefix: ''}, function(err, data) {
    if (data.Contents.length) {
      async.each(data.Contents, function(file, cb) {
        var params = {
          Bucket: bucketName,
          CopySource: bucketName + '/' + file.Key,
          Key: file.Key.replace(oldPrefix, newPrefix)
        };
        s3.copyObject(params, function(copyErr, copyData){
          if (copyErr) {
            console.log(copyErr);
          }
          else {
            console.log('Copied: ', params.Key);
            cb();
          }
        });
      }, done);
    }
  }); */
    /*  console.log('tring to do S3 all bucket')
    const listObjectsResponse = await s3
        .listObjectsV2({
            Bucket: 'townsquareinteractive',
            Prefix: 'wanderlustadventures',
            Delimiter: '/',
        })
        .promise()

    const folderContentInfo = listObjectsResponse.Contents
    const folderPrefix = listObjectsResponse.Prefix

    console.log(listObjectsResponse) */
    /*     const params = {
        Bucket: 'townsquareinteractive',
        Prefix: 'wanderlustadventures',
    }

    const listAllKeys = (params, out = []) =>
        new Promise((resolve, reject) => {
            s3.listObjectsV2(params)
                .promise()
                .then(({ Contents, IsTruncated, NextContinuationToken }) => {
                    out.push(...Contents)
                    !IsTruncated ? resolve(out) : resolve(listAllKeys(Object.assign(params, { ContinuationToken: NextContinuationToken }), out))
                })
                .catch(reject)
        })

    listAllKeys({ Bucket: 'bucket-name' }).then(console.log).catch(console.log) */
};
/* const s3Client = new S3Client({ region: 'your-region' }) */
export const deleteFolderS3 = async (folderKey) => {
    const listParams = {
        Bucket: tsiBucket,
        Prefix: folderKey,
    };
    const listedObjects = await s3.send(new ListObjectsV2Command(listParams));
    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        console.log('Folder is empty or does not exist');
        return;
    }
    // Delete all files within the folder
    const deleteParams = {
        Bucket: tsiBucket,
        Delete: {
            Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
            Quiet: true,
        },
    };
    await s3.send(new DeleteObjectsCommand(deleteParams));
    console.log('S3 Folder Deleted');
};
export const deleteFileS3 = async (key) => {
    console.log('File to be deleted', key);
    await s3.deleteObject({
        Bucket: tsiBucket,
        Key: key,
    });
    console.log('S3 File Deleted');
};
export const getCssFile = async (pageSlug, basePath) => {
    var options = {
        uri: `${bucketUrl}/${basePath}/styles/${pageSlug}.scss`,
        encoding: null,
    };
    let cssFile;
    try {
        await request(options, function (error, response, body) {
            cssFile = body.toString('utf-8');
            /*  if (error || response.statusCode !== 200) {
            console.log('failed to get css file')
            cssFile = ''
        } else {
            cssFile = body.toString('utf-8')
        } */
        });
    }
    catch (err) {
        console.log('error getting css page');
        return '';
    }
    return cssFile;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczNGdW5jdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbGl0aWVzL3MzRnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxRQUFRLENBQUE7QUFDL0IsTUFBTSxFQUFFLENBQUE7QUFDUixPQUFPLE9BQU8sTUFBTSxpQkFBaUIsQ0FBQTtBQUNyQyxNQUFNLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQTtBQUN6QyxNQUFNLFNBQVMsR0FBRyxnREFBZ0QsQ0FBQTtBQUNsRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDdkMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFHL0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7SUFDZCxXQUFXLEVBQUU7UUFDVCxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsSUFBSSxFQUFFO1FBQ2hELGtCQUFrQjtRQUNsQixlQUFlLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsSUFBSSxFQUFFO0tBQzlEO0lBQ0QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCO0NBQ3pDLENBQUMsQ0FBQTtBQUVGLGdGQUFnRjtBQUNoRixNQUFNLGNBQWMsR0FBRyxDQUFDLE1BQWdCLEVBQW1CLEVBQUU7SUFDekQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNuQyxNQUFNLE1BQU0sR0FBVSxFQUFFLENBQUE7UUFDeEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtRQUNoRCxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxH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