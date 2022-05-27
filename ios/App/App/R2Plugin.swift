import Foundation
import Capacitor
import Combine
import R2Shared
import R2Streamer

@objc(R2Plugin)
public class R2Plugin: CAPPlugin {
    
    private let reader: ReaderModule = ReaderModule()
    private var cancellable: AnyCancellable? = nil
    
    @objc func present(_ call: CAPPluginCall) {
        let message = call.getString("message") ?? ""
        let alertController = UIAlertController(title: "Alert", message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "Ok", style: .default))
        DispatchQueue.main.async {
            self.bridge?.viewController?.present(alertController, animated: true, completion: nil)
        }
    }
    
    @objc func openBook(_ call: CAPPluginCall) {
//        let urlStr = call.getString("url") ?? ""
        let urlStr = "https://standardebooks.org/ebooks/epictetus/short-works/george-long/downloads/epictetus_short-works_george-long.epub"
        guard let url = URL(string: urlStr) else {
            print("URL NOT FORMED", urlStr)
            return
        }
        print("URL IS", url.absoluteString)
        guard let vc = self.bridge?.viewController else {
            print("No View Controller")
            return
        }
        let result = self.reader.openPublication(at: url, allowUserInteraction: true, sender: vc)
        
        print ("Called open publication")
        self.cancellable = result.sink(receiveCompletion: {completion in
            print ("Completion", completion)
        }, receiveValue: {value in
            print ("Value", value)
        })
    }
    
   
    
}
