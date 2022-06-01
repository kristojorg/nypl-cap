//
//  ReaderModule.swift
//  This is the internal module to manage the R2 reader and submodules
//
//  Created by Kristo Jorgenson on 5/27/22.
//

import Foundation
import Capacitor
import Combine
import R2Shared
import R2Streamer
import R2Navigator



struct ReaderModule {
    private let streamer: Streamer
    private let publicationServer: PublicationServer
    private let httpClient: HTTPClient
    
    init() {
        guard let server = PublicationServer() else {
            /// FIXME: we should recover properly if the publication server can't start, maybe this should only forbid opening a publication?
            fatalError("Can't start publication server")
        }
        
        let httpClient = DefaultHTTPClient()
        self.streamer = Streamer()
        self.publicationServer = server
        self.httpClient = httpClient
    }
    
    /// Opens the Readium 2 Publication at the given `url`.
    func openPublication(at url: URL, sender: UIViewController) async {
        let publication = await parsePublication(at: url)
        
        print("Publication Parsed")
        // add it to the publication server
        do {
            try publicationServer.add(publication)
        } catch{
            fatalError("Could not add publication to publicationServer")
        }
        
        print("Pub added to pub server")
        
        // set up the new view controller
        let epubVC = await EPUBNavigatorViewController(publication: publication, resourcesServer: publicationServer)
        
        print("Epub View Controlled created")
        // note: cannot do these because we are using async/await here
//        let backItem = UIBarButtonItem()
//        epubVC.navigationItem.backBarButtonItem = backItem
//        epubVC.hidesBottomBarWhenPushed = true
        
        // present the new view controller on the stack
        await sender.present(epubVC, animated: true)
        
        print("epubVC Presented")
    }
    
    private func parsePublication(at url: URL) async -> Publication {
        let asset = FileAsset(url: url)
//        guard let mediaType = asset.mediaType() else {
//            fatalError("Asset had no media type")
//        }
        return await withCheckedContinuation { (continuation: CheckedContinuation<Publication, Never>) in
            self.streamer.open(asset: asset, allowUserInteraction: false) { result in
                switch result {
                    case .success(let pub):
                        continuation.resume(returning: pub)
                    default:
                        fatalError("Error parsing EPUB into Publication")
                }
            }
        }
    }
}
