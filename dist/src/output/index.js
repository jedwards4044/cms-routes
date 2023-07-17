import { addAssetFromSiteToS3, addFileS3 } from '../s3Functions.js';
import { updatePageList } from '../controllers/cms-controller.js';
//import { PublishData } from '../../types'
export const publish = async (data) => {
    const { siteIdentifier, siteLayout, pages, assets, globalStyles } = data;
    await addFileS3(siteLayout, `${siteIdentifier}/layout`);
    const pageList = [];
    if (pages && pages?.length != 0) {
        //adding each page to s3
        for (let i = 0; i < pages.length; i++) {
            console.log('page posting', `${siteIdentifier}/pages/${pages[i].data.slug}`);
            //rewrite page list every time to passed page
            pageList.push({ name: pages[i].data.title, slug: pages[i].data.slug, url: pages[i].data.url, id: pages[i].data.id });
            await addFileS3(pages[i], `${siteIdentifier}/pages/${pages[i].data.slug}`);
        }
        let newPageList;
        //update pagelist
        newPageList = await updatePageList(pages, siteIdentifier);
    }
    else {
        console.log('no pages to add');
    }
    //await addFileS3({ pages: pageList }, `${siteIdentifier}/pages/page-list`)
    if (assets && assets?.length != 0) {
        assets.forEach(async (asset) => {
            await addAssetFromSiteToS3(asset.content, siteIdentifier + '/assets/' + asset.name);
        });
    }
    await addFileS3(globalStyles, `${siteIdentifier}/global`, 'css');
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvb3V0cHV0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUNuRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUE7QUFFakUsMkNBQTJDO0FBQzNDLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDbEMsTUFBTSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUE7SUFFeEUsTUFBTSxTQUFTLENBQUMsVUFBVSxFQUFFLEdBQUcsY0FBYyxTQUFTLENBQUMsQ0FBQTtJQUV2RCxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUE7SUFFbkIsSUFBSSxLQUFLLElBQUksS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDN0Isd0JBQXdCO1FBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUcsY0FBYyxVQUFVLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUM1RSw2Q0FBNkM7WUFDN0MsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFDcEgsTUFBTSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsY0FBYyxVQUFVLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtTQUM3RTtRQUNELElBQUksV0FBVyxDQUFBO1FBQ2YsaUJBQWlCO1FBQ2pCLFdBQVcsR0FBRyxNQUFNLGNBQWMsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUE7S0FDNUQ7U0FBTTtRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtLQUNqQztJQUVELDJFQUEyRTtJQUUzRSxJQUFJLE1BQU0sSUFBSSxNQUFNLEVBQUUsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUMvQixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMzQixNQUFNLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsY0FBYyxHQUFHLFVBQVUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkYsQ0FBQyxDQUFDLENBQUE7S0FDTDtJQUVELE1BQU0sU0FBUyxDQUFDLFlBQVksRUFBRSxHQUFHLGNBQWMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ3BFLENBQUMsQ0FBQSJ9