import { updatePageList, transformPagesData, createOrEditLayout, deletePages, createGlobalStylesheet } from '../../src/controllers/cms-controller.js'
import { getFileS3, addFileS3 } from '../../src/s3Functions.js'
import { stripUrl, setColors, stripImageFolders } from '../../src/utils.js'
import { LunaRequest } from '../../types.js'

export const transformLuna = async (req: LunaRequest) => {
    try {
        //grab url to make S3 folder name
        const url = req.body.siteData.config.website.url
        const basePath = stripUrl(url)
        const themeStyles: any = setColors(req.body.siteData.design.colors, req.body.siteData.design.themes.selected)

        let globalFile
        globalFile = await createOrEditLayout(req.body.siteData, basePath, themeStyles, url)
        /*    await addFileS3(globalFile, `${basePath}/layout`) */

        let newPageList
        //Transforming and posting saved page data
        let newPageData: any = {}
        let globalStyles

        if (req.body.savedData.pages) {
            newPageData = await transformPagesData(req.body.savedData.pages, req.body.siteData.pages, themeStyles, basePath)

            // update/create pagelist (uses new page )
            newPageList = await updatePageList(newPageData.pages, basePath)
        }

        if (req.body.savedData.favicon) {
            const faviconName = stripImageFolders(req.body.savedData.favicon)
            console.log(
                'favicon time',
                req.body.savedData.favicon,
                req.body.siteData.config.website.url + req.body.savedData.favicon,
                basePath + '/assets/' + faviconName
            )
        }

        if (req.body.savedData.deletePages) {
            const pageListUrl = `${basePath}/pages/page-list`
            const updatedPageList = await deletePages(req.body.savedData.deletePages, basePath)
            await addFileS3(updatedPageList, pageListUrl)
        }

        if (req.body.savedData.colors || req.body.savedData.fonts || req.body.savedData.code || req.body.savedData.pages) {
            const currentPageList = await getFileS3(`${basePath}/pages/page-list.json`)
            globalStyles = await createGlobalStylesheet(themeStyles, req.body.siteData.design.fonts, req.body.siteData.design.code, currentPageList, basePath)
        }

        const luna = {
            siteIdentifier: basePath,
            usingPreviewMode: false,
            siteLayout: globalFile,
            pages: newPageData.pages || [],
            assets: [],
            globalStyles: globalStyles,
        }

        return luna
    } catch (error) {
        console.log(error)
        return { error: 'Luna transformer error' }
    }
}