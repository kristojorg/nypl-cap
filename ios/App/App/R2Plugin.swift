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
        let fm = FileManager.default
        let docsurl = try! fm.url(for:.documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
        // Hardcoded epub url. I simply placed it in the simulator file system.
        let url = docsurl.appendingPathComponent("book.epub")
        guard let vc = self.bridge?.viewController else {
            print("No View Controller")
            return
        }
        
        print("Calling reader module")
        
        Task {
            do {
                await reader.openPublication(at: url, sender: vc)
            }
        }
        
        print("Finisned opening publication.")
    }
    
   
    
}
