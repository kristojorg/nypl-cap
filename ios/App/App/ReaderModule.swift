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
    func openPublication(at url: URL, allowUserInteraction: Bool, sender: UIViewController?) -> AnyPublisher<(Publication, MediaType), LibraryError> {
        Future(on: .global()) { promise in
            let asset = FileAsset(url: url)
            guard let mediaType = asset.mediaType() else {
                promise(.failure(.openFailed(Publication.OpeningError.unsupportedFormat)))
                return
            }
            
            self.streamer.open(asset: asset, allowUserInteraction: allowUserInteraction, sender: sender) { result in
                switch result {
                case .success(let publication):
                    promise(.success((publication, mediaType)))
                case .failure(let error):
                    promise(.failure(.openFailed(error)))
                case .cancelled:
                    promise(.failure(.cancelled))
                }
            }
        }.eraseToAnyPublisher()
    }
}
